 const express=require("express")

require("dotenv").config()
const path=require("path")
const multer  = require('multer')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads")
    },
    filename:(req,file,cb)=>{
      
        cb(null,file.originalname)
        // cb(null,Date.now()+path.extname(file.originalname))
    }

})
const filter=(req,file,cb)=>{
    if(file.mimetype=="image/jpeg" || "image/png"){
        cb(null,true)
    } 

else{
    cb(null,false)
}
}

 const Upload=multer({
    storage:storage

})

module.exports= {Upload}

