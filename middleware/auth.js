const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require("../models/users");
const { Admin } = require("../models/users");


exports.checkToken = async (req, res, next) => {
  try {
  
  
    let checker = req.cookies.authuser;
  

    if (checker) {
   
      const datas = jwt.verify(checker, process.env.DB_SECRET);
   
      const user = await User.findOne({ _id: datas._id })
      .populate({path:"bookings", populate:{ path: "room" }})
      if (user) {
          res.locals.userData = user;
      } else {
        
      }
      next();
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({ error: "bad token" });
    
  }
};

exports.Checkuser = async (req, res, next) => {

  const user = res.locals.userData;
  req.user = user;
  next();
};
