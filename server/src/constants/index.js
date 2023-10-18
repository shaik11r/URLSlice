require('dotenv').config();
const env={
    PORT:process.env.PORT||3000,
    SITE_NAME:process.env.SITE_NAME||"urlslice",
    DEFAULT_DOMAIN:process.env.DEFAULT_DOMAIN|| "urlslice.it",
    LINK_LENGTH:parseInt(process.env.LINK_LENGTH,10) || 6,
    DB_HOST:process.env.DB_HOST||"localhost",
    DB_PORT:parseInt(process.env.DB_PORT,10)||5432,
    DB_NAME:process.env.DB_NAME || "mongoose",
    DB_USER:process.env.DB_USER || "",
    REDIS_HOST:process.env.REDIS_HOST||'127.0.0.1',
    REDIS_PORT:parseInt(process.env.REDIS_PORT,10)||6379,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD||"",
    USER_LIMIT_PER_DAY:parseInt(process.env.USER_LIMIT_PER_DAY,10)||10,
    NON_USER_COOLDOWN:parseInt(process.env.NON_USER_COOLDOWN,10)||10,
    DEFAULT_MAX_STATS_PER_LINK:parseInt(process.env.DEFAULT_MAX_STATS_PER_LINK,10),
    RECAPTCHA_SITE_KEY:process.env.RECAPTCHA_SITE_KEY||'',
    RECAPTCHA_SECRET_KEY:process.env.RECAPTCHA_SECRET_KEY||"",
    GOOGLE_SAFE_BROWSING_KEY:process.env.GOOGLE_SAFE_BROWSING_KEY||"",
    MAIL_HOST:process.env.MAIL_HOST ||"",
    REPORT_MAIL:process.env.REPORT_MAIL || "",
    CONTACT_EMAIL:process.env.CONTACT_EMAIL || "",
}
export default env;