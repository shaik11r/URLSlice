const mongoose = require("mongoose");

const url = "mongodb+srv://codeonlybro:YIjtEM3h2xI01I6H@cluster0.amrmjli.mongodb.net/urlshortner";

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
