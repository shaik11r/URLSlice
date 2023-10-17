const bcrypt = require("bcrypt");
const isbot = require("isbot");
const URL = require("url");
const dns = require("node:dns");
const { promisify } = require("util");
const query = require("../services/link");

const dnsLookup = promisify(dns.lookup);
const get = async (req, res) => {
  const { limit, skip, all } = req.context;
  const search = req.query.search;
  const userId = req.user.id;
  const match = {
    ...(!all && { user_id: userId }),
  };
  const [links, total] = await Promise.all([
    query.get(match, { limit, search, skip }),
    query.total(match, { search }),
  ]);
  const data=links.map(utils.sanitize.link);
};
