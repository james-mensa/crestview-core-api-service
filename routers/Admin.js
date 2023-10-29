const express=require("express")
const routers=express.Router()
const {Admin}=require("../models/users")
const { RegisterUser, sendOtp, ResetPass } = require("../config/gateway");

const {User} =require("../models/users")
const { Checkuser } = require("../middleware/auth")


routers.route("/create")
.post( async (req,res)=>{
    try {



     const user=new Admin ({
     ...req.body,
email:req.body.email,
     
 })

const saveduser=await user.save();
  res.status(200).json(saveduser);
        
    } catch (error) {
       res.status(400).json({msg:error}) 
    }
})











//sign in 




routers.route("/auth/signin").post(async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      console.log(email)
      const user_ac = await Admin.findOne({ email: email })
      if (user_ac) {
        const matchpassword = await user_ac.comparepassword(password);
  
        if (matchpassword) {
          const token = user_ac.generate_token();
          res.cookie("authuser", token).json(user_ac);
        }
        if (!matchpassword) {
          res.status(400).json({ msg: "Wrong user credentials" });
        }
      }
      if (!user_ac) {
        res.status(400).json({ msg: "user not found" });
       
      }
    } catch (error) {
      console.log({ last: error });
    
    }
  });
//////////////////////////////////////// get users 
routers.route("/admins")
.post( async(req,res)=>{
    try {
       

        const allusers=await Admin.find({}).sort({"createdAt":"desc"})
        

        if(!allusers){
            res.status(400).json({msg:"no admin found"})
        }
        if(allusers){
            res.status(200).json(allusers)
        }
    } catch (error) {
        res.status(400).json({msg:error})
        
    }
})
routers.route("/admin/:id")
.delete( async (req,res)=>{
    try {
        const _id=req.params.id;
        const user=await Admin.findOne({_id})
        if(!user){
            res.status(400).json({msg:"user not found"})
        }
        if(user){
            await Admin.findOneAndDelete({_id})
            res.status(200).json({msg:`${user.firstname} remove`})
        }

    } catch (error) {
        res.status(400).json({msg:error})
    }
})

routers.route("/profile")
.post(Checkuser,async (req,res)=>{
   try {
      
  const user= await Admin.findById(req.user._id)

  
  if(user){
    res.status(200).json(user)
 
  }
   
        
    } 
  

    catch (error) {
       res.send(error)
      
       
   }})



module.exports=routers