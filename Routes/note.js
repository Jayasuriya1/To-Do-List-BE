const {noteModel} = require("../Schema/noteSchema")
const {userModel} = require("../Schema/userSchema")
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const secretKey = "1jo$d%f#@6#f#g9"

const validate = async(req,res,next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1]
        const data = await jwt.decode(token)
        const secret = secretKey+data.email
        jwt.verify(token, secret, function(err, decoded) {
            if(err){
                res.status(400).json({
                    success:false,
                    message:"Token Experied"
                })
            }else{
                next()
            }
          });
    }else{
        res.status(400).json({
            success:false,
            message:"Token Not Found"
        })
    }
}


// Adding Notes
router.post("/add/:id", async(req,res)=>{
    try {
        const user = await userModel.findOne({_id:req.params.id})
        if(user){
            const {title,description,backgroundColor} = req.body
            const data = {
                userId: req.params.id,
                title,
                description,
                backgroundColor
            }
            const note = await noteModel.create(data)
            res.status(200).json({
                success:true,
                message:"Note Added Successfully"
            })
        }else{
            res.status(400).json({
                success:false,
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
})

// Update Notes
router.put("/update/:id", async(req,res)=>{
    try {
        const {id} = req.params
        const {title,description,backgroundColor} = req.body
        const note = await noteModel.findOne({_id:id})
        if(note){
            note.title = title
            note.description = description
            note.backgroundColor = backgroundColor
            note.lastEdited = Date.now()
            await note.save()
            res.status(200).json({
                success:true,
                message:"Notes Updated Successfully"
            })
        }else{
            res.status(400).json({
                success:false,
                message:"Note Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
})

// Delete Notes
router.delete("/delete/:id", async(req,res)=>{
    try {
        const {id} = req.params
        const note = await noteModel.findOne({_id:id})
        if(note){
            const note = await noteModel.deleteOne({_id:id})
            res.status(200).json({
                success:true,
                message:"Note Deleted Successfully"
            })
        }else{
            res.status(400).json({
                success:false,
                message:"Note Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
})

//Fetching Data
router.get("/data/:id",validate,async(req,res)=>{
    try {
        const note = await noteModel.find({userId:req.params.id})
        if(note){
            res.status(200).json({
                success:true,
                message:"Note Data Fetched Successfully",
                data:note
            })
        }else{
            res.status(400).json({
                success:false,
                message:"Note Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
})

module.exports = router