const express = require("express")
const cors = require("cors")
const app = express()
const {mongooseConnection} = require("./common/dbConfig")
const task = require("./Routes/user")

mongooseConnection()

app.use(cors())
app.use(express.json())
app.use("/",task)


app.listen(2500,console.log("Server is runing on 2500 PORT"))