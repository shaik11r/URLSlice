const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    googleToken: {
      access_token: String,
      refresh_token: String,
      token_type: String,
      expiry_date: Number,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      default:'default-slug'
    },
    createdAt: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    displayName: String,
    avatarUrl: String,
  },
  { timestamps: true }
);
// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
