const USER = require("../model/userModelUser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const axios = require('axios');

const verificartoken = async (req, res, next) => {
    let token
    try {
        token = req.headers.authorization.split(" ")[1]

        //  Retorna um objeto com os dados do utilizador
        const decoded = jwt.verify(token, ACCESS_TOKEN)
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "User not authorized" })
        return
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" })
        return
    }
}

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
                
                axios.post('http://localhost:7060/createLog', {
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
        return jwt.sign({id: users._id, username: users.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
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
        const create_user = await USER.create({ name, username, password: hashedPassword, email });
        console.log(create_user);
        axios.post('http://localhost:7060/createLog', {
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
        axios.post('http://localhost:7060/createLog', {
                    username: username,
                    log_id: 3
                })
                .then((response) => {
                    console.log(response.status);
                });
        response.status(200).json({ message : "Password Updated!" })
    } catch (error) {
        // Codigo expirou
    }
}

// Exports functions
module.exports = {
    verificartoken: verificartoken,
    login: login,
    registeruser: registeruser,
    changePassword: changePassword
}

/*
if (users[0]) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(request.body.password, salt);
            console.log("Salt: " + salt);
            console.log("Password: " + hashedPassword);

            // Name, Password, Email, Contact, Nif, Permission
            let user = new User(request.body.name, request.body.password, request.body.email, request.body.contact, request.body.nif, request.body.permission)

            // Verificar se ja existe alguem com esse mail
            let newuser = await dboperations.finduser(request.body.email)
            console.log("novo: ", newuser)
            if (newuser.length == 0) {
                dboperations.registeruser(user)
                response.status(201).send({message: "Registo efetuado"})
            } else response.status(401).send("Ja possui um utilizador com esse email!")

        }


*/