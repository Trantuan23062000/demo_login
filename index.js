const express = require('express')
const app = express()
const cors = require('cors')

const { route } = require('./routes/auth.js')

//middleware


app.use(express.json())
app.use(cors())


//routers
app.use("/auth", require("./routes/auth.js"))
app.use("/home",require("./routes/home.js"))



app.listen(3456,()=>{
    console.log("server running on : port 3456");
})



