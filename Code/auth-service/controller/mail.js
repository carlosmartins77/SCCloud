const { response } = require('express');
var nodemailer = require('nodemailer');
const User = require("../User");
const bcrypt = require("bcrypt");

const sendMail = async (req, res) =>{
    const {email, subject, username} = req.body
    const user_name = await User.find({username: username});

    if (user_name[0]) {
        // Desencrypted password
        const descrpPassword = await bcrypt.compare(req.body.password, users[0].password)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sccloud.18845.18836',
                pass: 'ivdsrknpyznfumfj' // 18845.18836
            }
        });

        var mailOptions = {
            from: 'sccloud.18845.18836',
            to: user_name[0].email,
            subject: 'Sending Email using Node.js',
            html: `<h3>${descrpPassword}</h3>` // Um Html bonito para isto!
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(404).json({ message : "Error send the email" });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message : "Email was been send" });
        }
        })
    } else {  res.status(200).json({ message : "Invalid Username" }); }
}

// Check if work!!
const changePassword = async () =>{
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1]
                // Access to Endpoint
                if (token == process.env.ACCESS_TOKEN_SECRET) {
                    const {password, email} = req.body
                    // Find User
                    const users = await User.find( { email : email} );
                    // Login with Valid Credential
                    if (users[0]) {
                        const salt = await bcrypt.genSalt();
                        const hashedPassword = await bcrypt.hash(password, salt);
                        console.log("Hash --------------------");
                        console.log("Salt: " + salt);
                        console.log("Password: " + hashedPassword);
                        const user = await User.findOneAndUpdate(email, { $password: hashedPassword });
                        response.status(200).json({ message : "Password has been changed" })
                    }else res.status(404).send({ message : "User does not exist" })
                } 
                res.status(404).send({ message : "  Error: erro to access the Endpoint" })
            }
        }catch (error) {
        console.log(error)
        res.status(401).json({ message: "User not authorized" })
        return
    }
}

module.exports = {
    sendMail: sendMail,
    changePassword: changePassword
}