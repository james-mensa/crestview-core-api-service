const express=require("express")
const mongoose=require("mongoose")
const app=express()
require("dotenv").config()
const bodyParser=require("body-parser")
const cookieParser = require('cookie-parser');

const PORT=process.env.PORT || 3003
const cors=require('cors');
//const MongoUrl=`mongodb+srv://rixoshotels:${process.env.DB_PASS}@cluster0.re47ble.mongodb.net/?retryWrites=true&w=majority`
const MongoUrl ="mongodb://localhost:27017"
const Admin=require("./routers/Admin")
const users=require("./routers/users")
const query=require("./routers/query")
const authService=require("./routers/auth/socialAuth.service")
const tokenizedAuthService=require("./routers/auth/tokenizedAuth.service")
const {AuthSession}=require("./middleware/auth")
const allowedOrigins = ['http://localhost:3000', 'https://rixoscomfort.netlify.app/']; // Replace with your frontend domains
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, 
  }));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(AuthSession)
/// middlewares

app.use("/admin",Admin)
app.use("/user",users)
app.use("/session",query)
app.use("/api/auth",authService)
app.use("/api/auth",tokenizedAuthService)


const DBconnect =async () => {
    try {
        mongoose.connect(MongoUrl) 
        console.log('Mongo connected')
    } catch(error) { 
        console.log(error)
        process.exit()
    }
}



app.listen(PORT,(er,res)=>{
    if(er){
        console.log("express not connected")
    }
    else  { 
        DBconnect()
        console.log(`express server running on ${PORT} `)
    }
})

app.use(express.static("client/build"));

if(process.env.NODE_ENV==="production"){
    const path=require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));

    });

}


