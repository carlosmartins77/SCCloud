const url= 'mongodb+srv://a18845:ola@sscloud.gwpoui3.mongodb.net/Authentication'

const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const con = await mongoose.connect(url)

        console.log(`MongoDB Connected:`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB