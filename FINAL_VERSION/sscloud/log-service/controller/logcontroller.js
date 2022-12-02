const Log = require("../Log");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

//const RabbitmqServer = require('../../auth-service/rabbit-server');

// Login Endpoint

const login = async(req, res) => {
    const { username, log_id} = req.body;
    console.log(username)
    try {
        const generate_log = await Log.create({ username, log_code_id: log_id });
        console.log(generate_log)
        res.status(200).json({ message: "Log generated" })
    } catch (Error) {
        res.status(404).send(Error)
    }

}


const seeLogsbyUsername = async(req, res) => {

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            console.log(decoded)

            const {username} = decoded
            console.log(username)
            // Access to Endpoint
            if (decoded.role === 'admin') {
                const generate_log = await Log.find();

                generate_log.forEach(x => {
                    if(x.log_code_id == 1) x.log_code_id = 'Login'
                    else if(x.log_code_id == 2) x.log_code_id = 'Registo'
                    else if(x.log_code_id == 3) x.log_code_id = 'Mudar Password'
                    else x.log_code_id = 'Enviar Email'
                })

                res.status(200).json({ logs: generate_log })
            } else {
                res.status(404).send({ message : "Not authorized to access the Endpoint" }) 
            }
        } catch (error) {
            res.status(401).json({ message: "User not authorized" })
            return
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" })
        return
    }
}


// Exports functions
module.exports = {
    login: login,
    seeLogsbyUsername:seeLogsbyUsername
}