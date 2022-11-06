const express = require('express')
const app = express()
const router = express.Router();
const { postUser, login, registeruser } = require('../controller/authcontroller')
const { sendMail, changePassword} = require('../controller/mail')

const { protect } = require("../middlewares/authmiddlewares")

app.use('/', router);
app.use(express.json());

//router.use("/", getUsers)

// Auth Routes
router.route("/auth/login").post(login);
//router.route("protect/logout").post(logout);
router.route("/auth/register").post(registeruser);

router.route("/sendMail").post(sendMail);

router.route("/changePassword").post(changePassword);

// Other Routes

module.exports = router