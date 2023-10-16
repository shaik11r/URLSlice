const mongoose = require("mongoose");

const ipSchema = new mongoose.Schema({
  ip: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});
const IP = mongoose.model("IP", ipSchema);
module.exports = IP;
