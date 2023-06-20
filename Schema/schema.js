const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema(
    {
        name:{ type:String,required:true},
        email:{
            type:String,
            required : true,
            lowercase:true,
            validate:(value)=>{
                return validator.isEmail(value)
            },
        },
        password:{type:String,required:true},
        notes:{type:Array,default:[]},
        todolist:{type:Array,default:[]},
        createdAt:{type:Date,default:Date.now}
    }
) 

const userModel = mongoose.model("user",userSchema)

module.exports = {userModel}