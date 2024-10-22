const express = require("express");
const { UserModel } = require("../../models");
const { RegisterUser } = require("../../config/gateway");
const { generateTimeBasedString } = require("../../lib/common");
const routers = express.Router();
const jwt = require("jsonwebtoken");


routers.route("/init").get(async (req, res) => {
  try {
    const { email } = req.query;
    const _user = await UserModel.findOne({email:email});
    if (_user) {
      if(_user.isSocialAuth) {
        res.status(200).json({
          path:'/new_password'
        });
      }else{
        res.status(200).json({
          path:'/login'
        });
      }

    }else{
      res.status(200).json({
        path:'/signup'
      });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});








routers.route("/register").post(async (req, res) => {
  try {
    const {name, email, password } = req.body;
    const check_user = await UserModel.findOne({ email: email });
    const _generatedString=generateTimeBasedString();
    const username=name+_generatedString;

    if (check_user && !check_user.isSocialAuth ) {
      res.status(400).json({
        msg: "email used already!!",
      });
    }
    if (!check_user) {
      const signtoken = jwt.sign(
        {name, username, email, password },
        process.env.ACCOUNT_ACTIVATION,
        { expiresIn: "1d" }
        );
      await RegisterUser(name, email, signtoken);
      res.status(200).json({
        msg: "User registered successfully, please check your email to activate account",
        user:name
      });
    }
  } catch (error) {
    console.log({ error})
    res.status(400).json({ msg: error });
  }
});


module.exports = routers;
