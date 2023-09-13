const mongoose = require("mongoose")

exports.mongooseConnection = async() => {
    try {
       const connect =  mongoose.connect(process.env.MONGODB_CONNECTION_URL)
       console.log("MongoDB connected Successfully")
    } catch (error) {
        console.log(error)
    }
}