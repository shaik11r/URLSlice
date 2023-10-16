const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.DBURL;

async function connect() {
  try {
    await mongoose.connect(url);
    console.log("mongoose connected");
  } catch (error) {
    console.log("error while connecting to database", error);
  }
}
module.exports = {
  connect,
};
