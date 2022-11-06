const { response } = require("express")
const jwt = require("jsonwebtoken")
const User = require("../User")


const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            // Find User
            const find_user = await User.find({ email : decoded})

            // Access to Endpoint
            if (find_user[0]) {
                next()
            } 
            res.status(404).send({ message : "  Error: erro to access the Endpoint" })
        } catch (error) {
            console.log(error)
            res.status(401).json({ message: "User not authorized" })
            return
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" })
        return
    }
}

module.exports = { protect }
