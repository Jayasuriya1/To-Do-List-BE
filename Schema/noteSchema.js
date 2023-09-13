const mongoose = require("mongoose")
const validator = require("validator")

const noteSchema = new mongoose.Schema(
    {
        userId:{type:String,require:true},
        title:{type:String,default:true},
        description:{type:String,default:true},
        backgroundColor:{type:String,default:true},
        lastEdited:{type:Date,default:Date.now},
        createdAt:{type:Date,default:Date.now}
    }
) 

const noteModel = mongoose.model("note",noteSchema)

module.exports = {noteModel}