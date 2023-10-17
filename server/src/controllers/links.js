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
  return res.send({
    total,
    limit,
    skip,
    data,
  })
};
const create=async(req,res)=>{
  const{
    reuse,
    customurl,
    description,
    target,
    domain,
    expire_in,
  }=req.body;
  const domain_id=domain?domain.id:null;
  const targetDomain=utils.removeWww(URL.parse(target).hostname)
  const queries=await Promise.all([
    validators.cooldown(req.use)
  ])
}