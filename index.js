const express = require("express")
const cors = require("cors")
const app = express()
const {mongooseConnection} = require("./common/dbConfig")
const user = require("./Routes/user")
const note = require("./Routes/note")

mongooseConnection()

app.use(cors())
app.use(express.json())

app.use("/user",user)
app.use("/note",note)


app.listen(2500,console.log("Server is runing on 2500 PORT"))