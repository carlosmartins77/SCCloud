const USER = require("../model/userModelUser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

// EXAMPLES
const postUser = async (req, res, next) =>{
    const users = await User.find();
    res.json(users);
};

// EXAMPLES
const postUser2 = async (req, res, next) =>{
  const { name, email, password } = req.body;
  console.log(name)
  if (name || email || password) {
    const users = await User.create({name:name, email:email, password:password});
    res
      .status(400)
      .json({ message: "Please make sure you've added all the fields" });
    return;
  }
};

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
                res.status(200).json({ token: accessToken })
            }else res.status(404).send({ message : "Invalid Credential" })
        }else res.status(404).send({ message : "Invalid Credential" })
    } catch (error) {
        res.status(404).send({ message : "Error: " + error.message })
    }
}


// Carlos para o RECAPTCHA
 const login2 = async (req, res) => {
    try {
        // Find User
        const users = await USER.find( { username : req.body.username} );
       
        // Login with Valid Credential
        if (users[0]) {
            // Check Password
            const descrpPassword = await bcrypt.compare(req.body.password, users[0].password);
            
            if (descrpPassword) {
                // Generate token
                const accessToken = generateAcessToken(req.body.username)
                if(recaptcha(req) == true){
                    res.status(200).json({ token: accessToken })
                }
                else res.status(404).send({ message : "Invalid reCaptcha"})
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
        response.status(200).json({ message : "Password Updated!" })
    } catch (error) {
        // Codigo expirou
    }

}

// Exports functions
module.exports = {
    postUser: postUser,
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