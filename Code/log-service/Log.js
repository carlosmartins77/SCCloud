const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username_id: {
      type: String,
    },
    log_code_id: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Logs", userSchema); // users
