const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema); // users
