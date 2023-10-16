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
      default: "default-slug",
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
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    bans:{
      type:[Date],
      default:[],//default null 
    },
  },
  { timestamps: true }
);
// Create the User model
const User = mongoose.model("User", userSchema);

userSchema.pre('save',function(next){
  if(this.isModified('bans')&&this.bans.length>0){
    if(this.bans.length>3){
      this.bans[this.bans.length-1]=new Date('2099-12-31T23:59:59.999Z')
    }
  }
  next();
})
module.exports = User;

