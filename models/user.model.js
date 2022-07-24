const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String },
    name: { type: String },
    sponsorUsername: { type: String },
    position: { type: String },
    level: { type: Number },
    levelIndex: { type: Number },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
