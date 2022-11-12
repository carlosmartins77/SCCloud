const { response, request } = require("express")
const { decode } = require("jsonwebtoken")
const jwt = require("jsonwebtoken")
const LOGIN = require("../model/userModelLogin")


const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            // Find User
            // Access to Endpoint
            const {id, username} = decoded
            req.user = { id: id, username : username,password : req.body.password};
            if (decoded) {
                next()
            } else {
                res.status(404).send({ message : "  Error: erro to access the Endpoint" }) 
            }
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
