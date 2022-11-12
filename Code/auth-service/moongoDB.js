const mongoose = require("mongoose")
//const url= 'mongodb+srv://a18845:ola@tpisi.kmq4m.mongodb.net/?retryWrites=true&w=majority';
const url= 'mongodb+srv://a18845:ola@sscloud.gwpoui3.mongodb.net/Authentication'
const url_LOCAHOST = 'mongodb://localhost:50'

const connectDB = async () => {
    try {
        const con = await mongoose.connect('mongodb://localhost:52320/AIS')

        console.log(`MongoDB Connected:`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB