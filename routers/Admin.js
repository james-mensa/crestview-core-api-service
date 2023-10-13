const express=require("express")
const routers=express.Router()
const {Admin}=require("../models/users")
const { RegisterUser, sendOtp, ResetPass } = require("../config/gateway");

const {User} =require("../models/users")
const { Checkuser } = require("../middleware/auth")


routers.route("/create")
.post( async (req,res)=>{
    try {

const check_user= await Admin.findOne({"email":req.body.email})
const check_username=await Admin.findOne({"username":req.body.username})

if(check_username || check_user){
    if(check_user){
        res.status(400).json({

            msg:"email used already!!"
        })
    }
    else{
        res.status(400).json({

            msg:"username taken!!"
        })
    }
   
}

 else if(!check_user && !check_username) {
     const user=new Admin ({
     ...req.body,
email:req.body.email,
     
 })

 const save_user= await user.save()
const gmailtoken=user.mailverify()
 const token=user.generate_token()
 await RegisterUser(save_user.email,gmailtoken)
 res.cookie("x-auth",token). json(save_user)


 }
  
        
    } catch (error) {
       res.status(400).json({msg:error}) 
    }
})
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