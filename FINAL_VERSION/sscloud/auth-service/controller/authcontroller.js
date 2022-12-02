const USER = require("../model/userModelUser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const axios = require('axios');

// Login Endpoint
const login = async (req, res) => {
    try {
        if (!req.body.captcha)
            return res.json({ success: false, msg: 'Please select captcha' });

        // Secret key
        const secretKey = '6LeC2eMiAAAAAEG40JGFTzzSTUifL9F6o8qGo0i7';

        // Verify URL
        const query = stringify({
            secret: secretKey,
            response: req.body.captcha,
            remoteip: req.connection.remoteAddress
        });
        const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

        // Make a request to verifyURL
        const body = await fetch(verifyURL).then(res => res.json());

        // If not successful
        if (body.success !== undefined && !body.success)
            return res.json({ success: false, msg: 'Failed captcha verification' });

        // If successful
        const { password, username } = req.body;
        // Find User
        //const users = await User.find( { email : req.body.username} );
        const users = await USER.findOne({ username }).lean();
        // Login with Valid Credential
        if (users) {
            // Check Password
            const descrpPassword = await bcrypt.compare(password, users.password);
            if (descrpPassword) {
                // Generate token
                const accessToken = generateAcessToken(users)
                
                axios.post('http://logservice:7060/createLog', {
                    username: username,
                    log_id: 1
                })
                .then((response) => {
                    console.log(response.status);
                });

                res.status(200).json({ token: accessToken })
            }else res.status(404).send({ message : "Invalid Credential" })
        }else res.status(404).send({ message : "Invalid Credential" })
    } catch (error) {
        res.status(404).send({ message : "Error: " + error.message })
    }
}


// Generate acess token
function generateAcessToken(users) {
    try {
        return jwt.sign({id: users._id, username: users.username, role: users.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
    } catch (error) {
        console.log(error)
    }
}

// Register Endpoint
const registeruser = async (request, response) => {
    const { name, email, password, username } = request.body;
    // Login with Valid Credential
    // Encrypt the Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hash --------------------");
    console.log("Salt: " + request.body.password);
    console.log("Password: " + hashedPassword);
    try {
        const create_user = await USER.create({ name, username, password: hashedPassword, email, role: 'user' });
        console.log(create_user);
        axios.post('http://logservice:7060/createLog', {
                    username: username,
                    log_id: 2
                })
                .then((response) => {
                    console.log(response.status);
                });
        response.status(200).json({ message : "User Created" })
    } catch (Error) {
        console.log(Error) // Com base no codigo de erro retornar algo 
        if(Error.code === 11000) response.status(404).send("Already exist this user") // Meter deste genero os codigos
        else { response.status(404).send(Error) }
    }
}


const changePassword = async (req, response) => {
    try{   
        const { id, username, password} =  req.user
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await USER.updateOne(
            {id}, 
            {
                $set:{"password":hashedPassword}
            }
        )
        axios.post('http://logservice:7060/createLog', {
                    username: username,
                    log_id: 3
                })
                .then((response) => {
                    console.log(response.status);
                });
        response.status(200).json({ message : "Password Updated!" })
    } catch (error) {
        response.status(401).json({ message : "Error" })
    }
}

// Exports functions
module.exports = {
    login: login,
    registeruser: registeruser,
    changePassword: changePassword
}
