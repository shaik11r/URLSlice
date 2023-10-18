const bcrypt = require("bcrypt");
const isbot = require("isbot");
const URL = require("url");
const dns = require("node:dns");
const { promisify } = require("util");
const query = require("../services/link");
const validators = require("../middleware/validators");
const utils = require("../util/index");
const { quartersInYear } = require("date-fns");
const env = require("../constants/index");

const dnsLookup = promisify(dns.lookup);
const get = async (req, res) => {
  const { limit, skip, all } = req.context;
  const search = req.query.search;
  const userId = req.user.id;
  const match = {
    ...(!all && { user_id: userId }),
  };
  const [links, total] = await Promise.all([query.get(match, { limit, search, skip }), query.total(match, { search })]);
  const data = links.map(utils.sanitize.link);
  return res.send({
    total,
    limit,
    skip,
    data,
  });
};
const create = async (req, res) => {
  const { customurl, description, target, domain, expire_in } = req.body;
  const domain_id = domain ? domain.id : null;
  const targetDomain = utils.removeWww(URL.parse(target).hostname);
  const queries = await Promise.all([
    validators.cooldown(req.user),
    validators.malware(req.user, target),
    validators.linksCount(req.user),
    customurl &&
      query.link.find({
        address: customurl,
        domain_id,
      }),
    !customurl && utils.generateId(domain_id),
    validators.bannedDomain(targetDomain),
    validators.bannedHost(targetDomain),
  ]);
  const address = customurl || queries[4];
  const link = await query.link.create({
    address,
    domain_id,
    description,
    target,
    expire_in,
    user_id: req.user && req.user.id,
  });
  if (!req.user && env.NON_USER_COOLDOWN) {
    query.ip.add(req.realIp);
  }
  return res.status(201).send(utils.sanitize.link({ ...link, domain: domain?.address }));
};
