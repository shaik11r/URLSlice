const express = require("express");
require("dotenv").config();
const setupGoogle = require("./src/google");
const { connect } = require("./src/config/database");
const session = require("express-session");
const passport = require("passport");
const server = express();
const ROOT_URL = "http://localhost:3000";
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
server.get("/", (req, res) => {
  res.send({
    message: "hi from server",
  });
});
server.listen(process.env.PORT, async () => {
  console.log("server running on port 3000");
  await connect();
});
