const {userModel} = require("../Schema/schema")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');

const secretKey = "1jo$d%f#@6#f#g9"


//Register
router.post("/signup",async(req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt)
            req.body.password = hashedPassword
            const user = await userModel.create(req.body)
            res.status(200).json({
                message:"User SignUp Successfully"
            })
        }else{
            res.status(400).json({
                message:"User Already Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
})


//Login
router.post("/login",async(req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email})
        if(user){
            if(await bcrypt.compare(req.body.password,user.password)){
                const payload = {
                    name:user.name,
                    email:user.email,
                    id:user._id
                }
                const token = await jwt.sign(payload,secretKey,{expiresIn:"1m"})
                res.status(200).json({
                    message:"User Login Successfully",
                    token,
                    id:user._id
                })
            }else{
                res.status(400).json({
                    message:"Invaild Password"
                })
            }
            
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
})

const validate = async(req,res,next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1]
        const data = await jwt.decode(token)
        if(Math.round((new Date())/1000)<data.exp){
            next()
        }else{
            res.status(400).json({
                message:"Token Experied"
            })
        }
    }else{
        res.status(400).json({
            message:"Token Not Found"
        })
    }
}


//Fetching Data
router.get("/:id",validate,async(req,res)=>{
    try {
        const user = await userModel.findOne({_id:req.params.id},{password:0})
        if(user){
            res.status(200).json({
                user,
                message:"User Data Fetched Successfully"
            })
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
})


// Adding Notes
router.post("/add/:id", async(req,res)=>{
    try {
        const user = await userModel.findOne({_id:req.params.id})
        if(user){
            const data = user.notes
            const {title,description} = req.body
            const newData = {
                id:uuidv4(),
                title,
                description,
                color:"#fff",
                lastEdited:new Date().toString()
            }
            user.notes = [newData,...data]
            await user.save()
            
            res.status(200).json({
                message:"Notes Added Successfully"
            })
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            ...error
        })
    }
})


// Delete Notes
router.delete("/delete/:id/:note_id", async(req,res)=>{
    try {
        const {id,note_id} = req.params
        const user = await userModel.findOne({_id:id})
        if(user){
            const data = user.notes
            const filterData = data.filter((data)=>{
                return data.id !== note_id
            })
            user.notes = filterData
            await user.save()
            res.status(200).json({
                message:"Note Deleted Successfully"
            })
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
})

// Update Notes
router.put("/update/:userId/:note_id", async(req,res)=>{
    try {
        const {userId,note_id} = req.params
        const {id,title,description,color,lastEdited} = req.body
        const user = await userModel.findOne({_id:userId})
        if(user){
            const data = user.notes
            const index = data.findIndex((data)=>{
                return data.id == note_id
            })
            const newData = {
                id,
                title,
                description,
                color,
                lastEdited:new Date().toString()                
            }
            user.notes[index] = newData
            await user.save()
            res.status(200).json({
                message:"Notes Updated Successfully"
            })
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
})

module.exports =router