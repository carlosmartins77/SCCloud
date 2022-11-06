const Log = require("../Log");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

// Login Endpoint
const login = async (req, res) => {
    try {
        const { username_id , log_code_id } = req.body;
        console.log(username_id, log_code_id);
        const users = await Log.create( { username_id: username_id, log_code_id: log_code_id } );
        res.status(200).send({message: 'Log added successfully'});
    } catch (error) {
        res.status(404).send({ message : "Error: " + error.message })
    }
}

// Exports functions
module.exports = {
    login: login,
}