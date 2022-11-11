const express = require('express')
const app = express()
const router = express.Router();
const { login } = require('../controller/logcontroller')

app.use('/', router);
app.use(express.json());

// Auth Routes
router.route("/createLog").post(login);


// Other Routes

module.exports = router