const express = require("express");
const routers = express.Router();
const  axios =require("axios");
const { User } = require("../../models/users");
const { generateTimeBasedString, normalizeAndConcatenate, getInitials } = require("../../lib/common");
const { appConfig } = require("../../config/appConfig");
const GOOGLE_AUTH_LINK="https://www.googleapis.com/oauth2/v1/userinfo"


// GET /api/google/callback
routers.route("/google").post(async (req, res) => {
    try {
      const { token } = req.body;
      console.log("server side request")
      const authResponse=await axios.get(`${GOOGLE_AUTH_LINK}?access_token=${token}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
      })
      if(authResponse){
              const client=authResponse.data;
              console.log({client})
              const user = await User.findOne({ email: client.email});
              if(!user){
              const _generatedString=generateTimeBasedString();
              const _normalizeUserName=normalizeAndConcatenate(client.name)
              const _userName=_normalizeUserName+_generatedString;
              const _user={
                fullname:client.name,
                username:_userName,
                email: client.email,
                password:"",
                picture:client.picture,
                alias:getInitials(client.name),
                isSocialAuth:true
              }
              const newUser = new User(_user);
              await newUser.save();
              const token = newUser.generate_token();
              res.cookie(appConfig.accessToken, token, { httpOnly: true, secure: true }).json(newUser);
              }else{
              const refreshToken = user.generate_token();
              res.cookie(
                `${appConfig.refreshToken}`, 
                refreshToken, 
                {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'None', 
                  domain: 'https://rixoshotels.onrender.com'
                }
              );
              return res.json(user);
              }


      }
   

    } catch (error) {
      console.log({errorMessage:error})
      res.status(400).json({ msg: error });
    }
  });

  routers.route('/session').get(async(req,res)=>{
try {

  const refreshToken = req.cookies.refreshToken;
  console.log({refreshToken})
  if (refreshToken) {
    res.json({ message: 'Refresh token is set', refreshToken });
  } else {
    res.status(401).json({ message: 'Refresh token is not set' });
  }

} catch (error) {
  console.log({new_error: error})
}

  } )
module.exports = routers;
