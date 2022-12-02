const express = require('express')
const app = express()
const router = express.Router();
const { login, seeLogsbyUsername } = require('../controller/logcontroller')

app.use('/', router);
app.use(express.json());

// Auth Routes
router.route("/createLog").post(login);

router.route("/seeLogsbyUsername").get(seeLogsbyUsername);


// Other Routes

module.exports = router