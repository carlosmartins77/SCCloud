const Log = require("../Log");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

//const RabbitmqServer = require('../../auth-service/rabbit-server');

// Login Endpoint
const login = async(req, res) => {
    try {

        const server = new RabbitmqServer('amqp://admin:admin@rabbitmq:5672');
        await server.start();
        await server.publishInQueue('nest', JSON.stringify(req.body));
        await server.publishInExchange('amq.direct', 'rota', JSON.stringify(req.body));
        console.log(JSON.stringify(req.body))
            //const { username_id , log_code_id } = req.body;
            //console.log(username_id, log_code_id);
            //const users = await Log.create( { username_id: username_id, log_code_id: log_code_id } );
            //res.status(200).send({message: 'Log added successfully'});
    } catch (error) {
        res.status(404).send({ message: "Error: " + error.message })
    }
}

const login2 = async(req, res) => {
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

// Exports functions
module.exports = {
    login: login,
    login2: login2
}