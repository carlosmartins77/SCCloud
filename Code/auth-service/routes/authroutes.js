const express = require('express')
const app = express()
const router = express.Router();
const { postUser, login, registeruser, changePassword } = require('../controller/authcontroller')
const { sendMail} = require('../controller/mail')
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const path = require('path');

const { protect } = require("../middlewares/authmiddlewares");
const { dirname } = require('path');

app.use('/', router);
app.use(express.json());

//router.use("/", getUsers)

// Auth Routes
router.route("/auth/login").post(login);
//router.route("protect/logout").post(logout);
router.route("/auth/register").post(registeruser);

router.use("/protect", protect) 
router.route("/protect/sendMail").post(sendMail);
router.route("/protect/changePassword").post(changePassword);



router.route('/loginfile').get((req,res) =>{
    res.sendFile(__dirname + '/index.html');
});

router.route('/subscribe').post( async (req,res)=>{

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
  return res.json({ success: true, msg: 'Captcha passed' });
});


//
router.route("/htmlfile").get((req, res) => {
res.send(`<IDOCTYPE htel>
    <html <IDOCTYPE htel>
    <html lang="en">

    <head>
        <meta charset="UTF=8">
        <meta http-equiv="X=UA=Compatible" content="IE=edge">
        <meta name="viewport" content="widthedevice=width,initial=scale=1.0">
        <link rel="stylesheet" href="style.css">
        <script src="../Register/script.js"></script>
        <title>Login</title>
    </head>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100&display=swap');
body {
    margin: 0;
    font-family: 'Noto Sans', sans-serif;
}

body * {
    box-sizing: border-box;
}

.main-login {
    width: 100vw;
    height: 100vh;
    background: #201b2c;
    display: flex;
    justify-content: center;
    align-items: center;
}

.main-register {
    width: 100vw;
    height: 100vh;
    background-color: #4d5d72;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
}

.left-login {
    font-size: 1.2vw;
    width: 50vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.left-login>h1 {
    color: #77ffc0;
}

.right-login {
    width: 50vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-login {
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px 35px;
    background: #4d5d72;
    border-radius: 20px;
    box-shadow: 0px 10px 40px #00000056;
}

.card-login>h1 {
    color: #dfdfe0;
    font-weight: 800;
    margin: 0;
}

.textfield {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 10px 0px;
}

.textfield>input {
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 15px;
    background: #dfdfe0;
    color: #4d5d72;
    font-size: 12px;
    box-shadow: 0px 10px 40px #00000056;
    outline: none;
    box-sizing: border-box;
}

.textfield>label {
    color: #f0ffffde;
    margin-bottom: 10px;
}

.btn-login {
    width: 100%;
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

.login-image {
    width: 35vw;
}

@media only screen and (max-width: 950px) {
    .card-login {
        width: 85%;
    }
}

@media only screen and (max-width:600px) {
    .card-login {
        width: 85%;
    }
    .left-login>h1 {
        display: none;
    }
    .left-login {
        width: 100%;
        height: auto;
    }
    .right-login {
        width: 100%;
        height: auto;
    }
    .login-image {
        width: 50vw;
    }
}
    </style>

    <body>
        <div class="main-register">
            <div class="left-login">
            </div>
            <div class="right-login">
                <div class="card-login">
                    <h1> Change Password </h1>
                    <div class="textfield">
                        <label for="password">New Password</label>
                        <input type="password" name="password" id="password" placeholder="Password">
                    </div>
                    <div class="textfield">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Password">
                    </div>
                    <button class="btn-login" onclick="changepassword()"> Change </button>
                </div>
            </div>
        </div>
    </body>
    <script>
    async function changepassword(){
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        console.log(confirmPassword, password);
        if (password != confirmPassword) return;
        const url = 'http://localhost:7070/protect/changePassword'
        const data = { 
            password: password
        }

        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer localStorage.getItem("token")' 
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => {
        console.log(err);
        });
        return true;
    }

    console.log(localStorage.getItem('token'))
    </script>
    </html>`)
});

// Other Routes

module.exports = router