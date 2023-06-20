const mongoose = require("mongoose")

exports.mongooseConnection = async() => {
    try {
       const connect =  mongoose.connect("mongodb+srv://jayasuriya:1999suriya@cluster0.6bctsuz.mongodb.net/to-do-list")
       console.log("MongoDB connected Successfully")
    } catch (error) {
        console.log(error)
    }
}