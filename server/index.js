const express = require("express");
require("dotenv").config();
const setupGoogle = require("./src/google");
const { connect } = require("./src/config/database");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const server = express();
const ipv = require("request-ip");
const ROOT_URL = "http://localhost:3000";

server.use(helmet({ contentSecurityPolicy: false }));
server.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

server.use(passport.initialize());
server.use(passport.session());
require("./src/routes/home")(server);

setupGoogle({ server, ROOT_URL });
server.set("trust proxy", true);
server.use(ipv.mw());

server.get("/", (req, res) => {
  const clientIP = req.clientIp;
  res.send({
    message: "hi from server",
    data: `${req.ip}`,
    ip: clientIP,
  });
});

server.listen(process.env.PORT, async () => {
  console.log(`server running on port:${process.env.PORT}`);
  await connect();
});
