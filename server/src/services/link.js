const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Link = require("../models/links");

const selectable = [
  "id",
  "address",
  "banned",
  "createdAt",
  "domain_id",
  "target",
  "updatedAt",
  "expire_in",
  "visit_count",
  "uuid",
  "user_id",
  "description",
  "domain",
];
const normailzeMatch = (match) => {
  const newMatch = { ...match };
  if (newMatch.address) {
    newMatch["address"] = newMatch.address;
    delete newMatch.address;
  }
  if (newMatch.user_id) {
    newMatch["user_id"] = newMatch.user_id;
    delete newMatch.user_id;
  }
  if (newMatch.uuid) {
    newMatch["uuid"] = newMatch.uuid;
    delete newMatch.uuid;
  }
  return newMatch;
};

export const create = async (params) => {
    const link = new Link({
      domain_id: params.domain_id || null,
      user_id: params.user_id || null,
      address: params.address,
      description: params.description || null,
      expire_in: params.expire_in || null,
      target: params.target,
    });
    await link.save();
    return link;
  };
//total links count
export const total = async (match, params = {}) => {
  const query = Link.find(match);
  if (params.search) {
    query.or([
      { description: { $regex: params.search, $options: "i" } },
      { address: { $regex: params.search, $options: "i" } },
      { target: { $regex: params.search, $options: "i" } },
    ]);
  }
  const count = await query.countDocments();
  return count;
};

//const remove link
export const remove = async (match) => {
  const link = await Link.findOne(match);
  if (!link) {
    throw new Error("link was not found");
  }
  await Link.deleteOne({ _id: link._id });
  //delete cached also
  return true;
};
export const get = async (match, params) => {
  const query = Link.find(noramlizeMatch(match))
    .select(selectable)
    .skip(params.skip)
    .limit(params.limit)
    .sort({ createdAt: -1 });

    if(params.search){
        query.or([
            {description:{$regex:params.search,$options:"i"}},
            {address:{$regex:params.search,$options:"i"}},
            {target:{$regex:params.search,$options:"i"}},
            {domain:{$regex:params.search,$options:"i"}},
        ])
    }
    query.populate("domain_id","address");
    const links=await query.exec();
    return links;
};
export const find=async(match)=>{
   const link=await Link.findOne(normailzeMatch(match)).populate('domain_id',"address");
   //cache here
   return link
}
export const update=async(match,update)=>{
    const links=await Link.updateMany(match,{...update,updatedAt:new Date().toISOString()})
    //cache has to done here future 
    return links;
}
export const incrementVisit=async(match)=>{
    await Link.updateOne(match,{$inc:{visit_count:1}});
}
