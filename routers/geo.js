const express = require("express");
const { User } = require("../models/users");
const routers = express.Router();
const jwt = require("jsonwebtoken");
const { GetGeo } = require("../middleware/auth");
require("dotenv").config();
routers.route("/user/:id").post(async (req, res) => {
  try {
    const responsefull = await fetch(
      `https://api.ipdata.co/?api-key=${process.env.ipgeoAPI}`
    );
    const ipa = await responsefull.json();
    const country = await ipa.country_name;
    const userphonecode = await ipa.calling_code;
    const continent = await ipa.continent_name;
    const state_c = await ipa.region;
    const timezone = [
      await ipa.time_zone.name,
      await ipa.time_zone.current_time,
    ];
    const ipaddress = await ipa.ip;
    const _id = req.params.id;
    const account = await User.findById({ _id });

    if (account) {
      const username = account.username;

      await User.findByIdAndUpdate(
        { _id },
        {
          $set: {
            country: country,
            phonecode: userphonecode,
            timezone: timezone,
            state_c: state_c,
            continent: continent,
            ipaddress: ipaddress,
          },
        },
        {
          new: true,
        }
      );

      const geotoken = jwt.sign(
        {
          username,
          country,
          userphonecode,
          timezone,
          state_c,
          continent,
          ipaddress,
        },
        process.env.ACCOUNT_ACTIVATION,
        { expiresIn: "1d" }
      );
      res.status(200).cookie("geo", geotoken).json({
        user: account.firstname,
        country: country,
        phonecode: userphonecode,
        timezone: timezone,
        state_c: state_c,
        continent: continent,
        ipaddress: ipaddress,
      });
    
    }
  } catch (error) {
    
  }
});

routers.route("/cookieip").post(async (req, res) => {
  try {
    const responsefull = await fetch(
      `https://api.ipdata.co/?api-key=${process.env.ipgeoAPI}`
    );
    const ipa = await responsefull.json();
    const country = await ipa.country_name;
    const userphonecode = await ipa.calling_code;
    const continent = await ipa.continent_name;
    const state_c = await ipa.region;
    const timezone = [
      await ipa.time_zone.name,
      await ipa.time_zone.current_time,
    ];
    const ipaddress = await ipa.ip;

    const geotoken = jwt.sign(
      {
        country,
        userphonecode,
        timezone,
        state_c,
        continent,
        ipaddress,
      },
      process.env.ACCOUNT_ACTIVATION,
      { expiresIn: "1d" }
    );
    res.status(200).cookie("geo", geotoken).json(geotoken)
  } catch (error) {
    
    res.status(404).json({ error: error });
  }
});

routers.route("/userip").post(async (req, res) => {
  try {


 const details=await GetGeo(req.body)

   res.status(200).json(
      details
    );
  } catch (error) {
    
    res.status(404).json({ error: error });
  }
});

routers.route("/cookieverify").post(async (req, res) => {
  try {

  
    const { country, userphonecode, timezone, state_c, continent, ipaddress } =
      jwt.verify(req.body.token, process.env.ACCOUNT_ACTIVATION, {
        expiresIn: "1d",
      });
    res.status(200).json({
      country,
      userphonecode,
      timezone,
      state_c,
      continent,
      ipaddress,
    });
  } catch (error) {
    
    res.status(404).json({ error: error });
  }
});



module.exports = routers;
  