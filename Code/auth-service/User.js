const mongoose = require("mongoose");
// Mudar isto para ser apenas do login e depois para o registo ser outro
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
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
