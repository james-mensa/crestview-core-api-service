const express = require("express");
const routers = express.Router();
const { Admin } = require("../models/users");
const {
  RegisterUser,
  sendOtp,
  ResetPass,
  Contactmail,
} = require("../config/gateway");

const { User } = require("../models/users");
const { isAuthorized } = require("../middleware/auth");

routers.route("/adminstrator/newaccount/:id").post(async (req, res) => {
  try {
    const admin = await Admin.findById({ _id: req.params.id });

    if (admin && admin.role === "admin") {
      const exitAccount = await Admin.find({ email: req.body.email });

      if (exitAccount && exitAccount.length === 0) {
        const user = new Admin({
          ...req.body,
          email: req.body.email,
        });
        const saveduser = await user.save();
        await Contactmail(
          saveduser.email,
          ` hi, ${saveduser.fullname} you been registed as an ${req.body.role} at Rixos Hotel .login details : EMAIL: ${req.body.email} PASSWORD : ${req.body.password}.Visit https://rixoslodge.netlify.app/ to login,`
        );
        res.status(200).json(saveduser);
      } else if (exitAccount) {
        res.status(400).json({ msg: "Account Already exits" });
      }
    } else {
      res.status(404).json({ msg: "Permission denied" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

//sign in

routers.route("/auth/signin").post(async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
  
    const user_ac = await Admin.findOne({ email: email });
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

  }
});

routers.route("/auth/signout").post(async (req, res, next) => {
  try {
    res.status(200).clearCookie("authuser");

    next();
  } catch (error) {
   
  }
});
routers.route("/adminstrator/accounts/:id").get(async (req, res) => {
  try {
    const admin = await Admin.findById({ _id: req.params.id });
    if (admin && admin.role === "admin") {
      const allusers = await Admin.find({});
      if (!allusers) {
        res.status(400).json({ msg: "no account found" });
      }

      if (allusers) {
        res.status(200).json(allusers);
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  
  }
});

// unblock admin
routers
  .route("/adminstrator/unblockuser/:id/:admin")
  .patch(async (req, res, next) => {
    try {
      const _id = req.params.id;

      const admin = await Admin.findById({ _id: req.params.admin });
      if (admin && admin.role === "admin") {
        const user = await Admin.findOne({ _id });
        if (!user) {
          res.status(400).json({ msg: "user not found" });
          next();
        }
        if (user) {
          const userdata = await Admin.findByIdAndUpdate(
            { _id },
            {
              $set: {
                ...req.body,
                active: true,
              },
            },
            { new: true }
          );
          res.status(200).json({ msg: `${userdata.fullname}` });

          await Contactmail(
            user.email,
            ` hi, ${user.fullname} your account has been recovered`
          );
        }
      }
    } catch (error) {
      //   res.status(400).json({ msg: error });
    }
  });

/// BLOCK ADMINS
routers
  .route("/adminstrator/blockuser/:id/:admin")
  .patch(async (req, res, next) => {
    try {
      const _id = req.params.id;
      const admin = await Admin.findById({ _id: req.params.admin });
      if (admin && admin.role === "admin") {
        const user = await Admin.findOne({ _id });
        if (!user) {
          //   res.status(400).json({ msg: "user not found" });
        }
        if (user) {
          const userdata = await Admin.findByIdAndUpdate(
            { _id },
            {
              $set: {
                ...req.body,
                active: false,
              },
            },
            { new: true }
          );
          res.status(200).json({ msg: `${userdata.fullname}` });

          await Contactmail(
            user.email,
            ` hi, ${user.fullname} your account is temporarily Suspended .You need extra  information please contact Admin,`
          );
        }
      }
    } catch (error) {
      //   res.status(400).json({ msg: error });
      next();
      next();
    }
  });
//////////////////////////////////////// get users
routers.route("/admins").post(async (req, res) => {
  try {
    const allusers = await Admin.find({}).sort({ createdAt: "desc" });

    if (!allusers) {
      res.status(400).json({ msg: "no admin found" });
    }
    if (allusers) {
      res.status(200).json(allusers);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

////////////////////////////////// delete user

routers.route("/adminstrator/deluser/:id").delete(async (req, res) => {
  try {
    const _id = req.params.id;

    const user = await Admin.findByIdAndDelete(_id);
    if (user) {
      await Contactmail(
        user.email,
        "Sorry, you violated our terms and condition.Your account has been permenantly terminated"
      );
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routers.route("/admin/:id").delete(async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await Admin.findOne({ _id });
    if (!user) {
      res.status(400).json({ msg: "user not found" });
    }
    if (user) {
      await Admin.findOneAndDelete({ _id });
      res.status(200).json({ msg: `${user.firstname} remove` });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routers.route("/profile").post(isAuthorized, async (req, res) => {
  try {
    const user = await Admin.findById(req.user._id);

    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = routers;
