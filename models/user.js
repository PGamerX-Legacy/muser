const mongoose = require("mongoose");

const userinfo = new mongoose.Schema({
  UserID: {
    type: String || Number,
    required: true,
  },
  prefix: {
    type: String,
  },
  voter: {
    type: Boolean,
  },
  premium: {
    type: String,
  },
  createdAt: { type: Date, expires: "1w", default: Date.now },
});

module.exports = mongoose.model("muser_userinfo", userinfo)

