const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    code_id: {
      type: String,
    },
    code_description: {
      type: String
    },
  }
);

module.exports = mongoose.model("CodeDescription", userSchema); // users
