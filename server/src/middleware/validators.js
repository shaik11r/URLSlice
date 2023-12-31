const { body, param } = require("express-validator");
const { isAfter, subDays, subHours, addMilliseconds } = require("date-fns");
const urlRegex = require("url-regex-safe");
const { promisify } = require("util");
const axios = require("axios");
const dns = require("dns");
const URL = require("url");
const ms = require("ms");
const User = require("../models/user");
const { addProtocol, removeWww } = require("../util/index");
const query = require("../services/link");

const dnsLookup = promisify(dns.lookup);
const preservedUrls = [
  "login",
  "logout",
  "signup",
  "images",
  "url-info",
  "stats",
  "verify",
  "terms",
  "privacy",
  "protected",
  "report",
  "pricing",
  "404",
  "settings",
  "banned",
]; //preserving the url because users cant use this things again
const checkUser = (value, { req }) => !!req.user;
export const createLink = [
  body("target")
    .exists({ checkNull: true, checkFalsy: true }) //checking if it is NULL
    .withMessage("Target is missing")
    .isString() //checking is string
    .isLength({ min: 1, max: 2040 })
    .customSanitizer(addProtocol) //from utils sanitization
    .custom((value) => urlRegex({ exact: true, strict: false }).test(value) || /^(?!https?)(\w+):\/\//.test(value))
    .withMessage("URL is not valid")
    .custom((value) => removeWww(URL.parse(value).host) !== "slice")
    .withMessage(`urls are not allowed`),
  body("customurl")
    .optional({ nullable: true, checkFalsy: true })
    .custom(checkUser)
    .withMessage("Only users can use this field")
    .isString()
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage("custom url length must be between 1 and 64")
    .custom((value) => /^[a-zA-Z0-9-_]+$/g.test(value))
    .withMessage("custom URL is not valid")
    .custom((value) => !preservedUrls.some((url) => url.toLowerCase() === value))
    .withMessage(`you cant use this custom url`),
  body("description")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 0, max: 2040 })
    .withMessage("Description length must be between 0 and 2040."),
  body("expire_in")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .custom((value) => {
      try {
        return !!ms(value);
      } catch {
        return false;
      }
    })
    .withMessage("expire format is invalid. valid examples: 1m,8h,42days.")
    .customSanitizer(ms)
    .custom((value) => value >= ms("1m"))
    .withMessage("minimum expire time should be 1 minute")
    .customSanitizer((value) => addMilliseconds(new Date(), value).toISOString()),
  body("domain")
    .optional({ nullable: true, checkFalsy: true })
    .custom(checkUser)
    .withMessage("only users can this field .")
    .customSanitizer((value) => value.toLowerCase())
    .customSanitizer((value) => removeWww(URL.parse(value).hostname || value))
    .custom(async (address, { req }) => {
      if (address === env.DEFAULT_DOMAIN) {
        req.body.domain = null;
        return;
      }
      const domain = await query.domain.find({
        address,
        user_id: req.user.id,
      });
      req.body.domain = domain || null;
      if (!domain) return Promise.reject();
    })
    .withMessage("you cant use this domain."),
];
export const editLink = [
  body("target")
    .optional({ checkFalsy: true, nullable: true })
    .isString()
    .trim()
    .isLength({ min: 1, max: 2040 })
    .withMessage("maximum url length is 2040")
    .customSanitizer(addProtocol)
    .custom((value) => urlRegex({ exact: true, strict: false }).test(value) || /^(?!https?)(\w+):\/\//.test(value))
    .withMessage("url is not valid")
    .custom((value) => removeWww(URL.parse(value).host !== env.DEFAULT_DOMAIN))
    .withMessage(`default domain urls are not allowed`),
  body("address")
    .optional({ checkFalsy: true, nullable: true })
    .isString()
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage("Custom url length must be between 1 and 64")
    .custom((value) => !preservedUrls.some((url) => url.toLowerCase() === value))
    .withMessage("you cant use this custom url these are reserved"),
  body("expire_in")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .custom((value) => {
      try {
        return !!ms(value);
      } catch (error) {
        return false;
      }
    })
    .withMessage("EXPIRE format is invalid valid examples:1m,8h,42 days 1y")
    .customSanitizer(ms)
    .custom((value) => value >= ms("1m"))
    .withMessage("Minimum expire time should be '1minute'")
    .customSanitizer((value) => addMilliseconds(new Date(), value).toISOString()),
  body("description")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 0, max: 2040 })
    .withMessage("description length must be between 0 and 2040"),
  param("id", "ID is invalid").exists({ checkFalsy: true, checkNull: true }).isLength({ min: 36, max: 36 }),
];


//cooldown function for 12hrs
export const cooldown = (user) => {
  if (!process.env.GOOGLE_SAFE_BROWSING_KEY || !user || !urlRegexser.cooldowns) {
    return;
  }
  const hasCooldownNow = user.cooldowns.some((cooldown) => isAfter(subHours(new Date(), 12), new Date(cooldown)));
  if (hasCooldownNow) {
    throw new Error("Cooldown because of malware wait for 12hrs");
  }
};

//using google safebrowsing apis for malware detection

export async function malware(user, target) {
  if (!process.env.GOOGLE_SAFE_BROWSING_KEY) return;
  const isMalware = await axios.post(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_KEY}`,
    {
      client: {
        clientId: process.env.DEFAULT_DOMAIN.toLowerCase().replace(".", ""),
        clientVersion: "1.0.0",
      },
      threatInfo: {
        threatTypes: [
          "THREAT_TYPE_UNSPECIFIED",
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["ANY_PLATFORM", "PLATFORM_TYPE_UNSPECIFIED"],
        threatEntryTypes: ["EXECUTABLE", "URL", "THREAT_ENTRY_TYPE_UNSPECIFIED"],
        threatEntries: [{ url: target }],
      },
    }
  );
//if malware detected then banning the user 
  if (!isMalware.data || !isMalware.data.matches) return;
  if (user) {
    const updateUser = await User.findByIdAndUpdate(user.id, {
      $push: { cooldowns: new Date() },
    });
    if (updateUser.cooldowns.length > 2) {
      await User.findByIdAndUpdate(user.id, { banned: true });
      throw new Error("Too much malware request.You are now banned enjoy 😎");
    }
  }
  throw new Error(user ? "Malware detected cooldown for 12h " : "Malware detected");
}

//setting dates and checking limits per day 

export const linksCount=async(user)=>{
    if(!user)return;
    const count=await query.link.total({
        user_id:user.id,
        created_at:[">",subDays(new Date(),1 ).toString()]
    });
    if(count>env.USER_LIMIT_PER_DAY){
        throw new Error(`You have reached your daily limit (${env.USER_LIMIT_PER_DAY}). Please wait for 24hrs`);
    }
};
export const bannedDomain=async(domain)=>{
    const isBanned=await query.domain.find({
        address:domain,
        banned:true,
    })
    if(isBanned){
        throw new Error("URL Is containing malware/scam");
    }
};

export const bannedHost=async(domain)=>{
    let isBanned;
    try{
        const dnsRes=await dnsLookup(domain);
        if(!dnsRes|| !dnsRes.address)return;
        isBanned=await query.host.find({
            address:dnsRes.address,
            banned:true
        });
    }
    catch(error){
        isBanned=null;
    }
    if(isBanned){
        throw new Error('Url contains malware/scam')
    }
}