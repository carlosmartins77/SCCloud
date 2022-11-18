const mongoose = require("mongoose");

const logSchema = mongoose.Schema({
    username_id: {
        type: String,
    },
        username: { type: String
    },
    log_code_id: {
        type: String
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Logs", logSchema); // users