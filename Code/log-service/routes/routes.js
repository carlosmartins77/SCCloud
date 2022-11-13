const express = require('express')
const app = express()
const router = express.Router();
const { login, login2 } = require('../controller/logcontroller')

app.use('/', router);
app.use(express.json());

// Auth Routes
router.route("/createLog").post(login2);


// Other Routes

module.exports = router