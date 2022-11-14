const { response } = require('express');
var nodemailer = require('nodemailer');
const USER = require("../model/userModelUser");
const bcrypt = require("bcrypt");

const sendMail = async (req, res) =>{
    const {email, subject, username} = req.body
    const user_name = await USER.findOne({username}).lean();

    if (user_name) {
        // Desencrypted password
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sccloud.18845.18836',
                pass: 'ivdsrknpyznfumfj' // 18845.18836
            }
        });

        var mailOptions = {
            from: 'sccloud.18845.18836',
            to: user_name.email,
            subject: subject,
            html: `<IDOCTYPE htel>
            <html lang="en">
            <head>
                <meta charset="UTF=8">
                <meta http-equiv="X=UA=Compatible" content="IE=edge">
                <meta name="viewport" content="widthedevice=width,initial=scale=1.0">
            </head>
            <style> 
                .btn-login {
                    width: 225px;
                    padding: 16px 0px;
                    margin: 25px;
                    border: none;
                    border-radius: 8px;
                    outline: none;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 3px;
                    color: #4d5d72;
                    background: #dfdfe0;
                    cursor: pointer;
                    box-shadow: 0px 10px 40px -12px #dfdfe0;
                }
            </style>
            <body>
                <a href = "http://localhost:7070/htmlfile" > <button class="btn-login"> Change Password </button> </a>
            </body>
            </html>`
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
                    const users = await USER.find( { email : email} );
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

