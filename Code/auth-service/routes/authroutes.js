const express = require('express')
const app = express()
const router = express.Router();
const { postUser, login, registeruser, changePassword } = require('../controller/authcontroller')
const { sendMail} = require('../controller/mail')

const { protect } = require("../middlewares/authmiddlewares")

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

// Other Routes

module.exports = router