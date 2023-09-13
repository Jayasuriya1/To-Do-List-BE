const {userModel} = require("../Schema/userSchema")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
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

//Register
router.post("/signup",async(req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            const {name,email,password} = req.body
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt)
            const data ={
                name,
                email,
                password:hashedPassword
            }
            const user = await userModel.create(data)
            res.status(200).json({
                success:true,
                message:"User SignUp Successfully"
            })
        }else{
            res.status(400).json({
                success:false,
                message:"User Already Exist"
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
                const secret = secretKey+user.email
                const token = await jwt.sign(payload,secret)
                res.status(200).json({
                    success:true,
                    message:"User Login Successfully",
                    token,
                    id:user._id
                })
            }else{
                res.status(400).json({
                    success:false,
                    message:"Invaild Password"
                })
            }
            
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

//Fetching User Data By Id
router.get("/data/:id",validate,async(req,res)=>{
    try {
        const user = await userModel.findOne({_id:req.params.id},{password:0})
        if(user){
            res.status(200).json({
                success:true,
                data:user,
                message:"User Data Fetched Successfully"
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

module.exports =router