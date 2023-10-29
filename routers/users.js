const express = require("express");
const { route } = require("express/lib/application");
const { Checkuser, checkToken, GetGeo } = require("../middleware/auth");
const {} = require("../models/users");
require("dotenv").config();
const routers = express.Router();
const { User } = require("../models/users");
const { sortArticles } = require("../middleware/utils");
const {
  RegisterUser,
  sendOtp,
  ResetPass,
  Contactmail,
  ContactmailClient,
} = require("../config/gateway");

const jwt = require("jsonwebtoken");
const { Admin } = require("../models/users");
const bcryt = require("bcrypt");
const { CardModel } = require("../models/Database");
/////////////////////////////////////////////// create new user

routers.route("/preregister").post(async (req, res) => {
  try {
    const { fullname, email, password, username } = req.body;
    const check_user = await User.findOne({ email: email });

    if (check_user) {
      res.status(400).json({
        msg: "email used already!!",
      });
    }
    if (!check_user) {
      const signtoken = jwt.sign(
        { fullname, username, email, password },
        process.env.ACCOUNT_ACTIVATION,
        { expiresIn: "1d" }
      );

      await RegisterUser(fullname, email, signtoken);
      res.status(200).json(req.body.fullname);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routers.route("/authenticateme").post(async (req, res) => {
  try {
    const { fullname, username, email, password, role } = jwt.verify(
      req.body.t,
      process.env.ACCOUNT_ACTIVATION
    );

    if (role) {
      const check_user = await Admin.findOne({ email: email });

      if (check_user) {
        res.status(400).json({
          msg: "email verified or registered already!!",
        });
      }
      if (!check_user) {
        const user = new Admin({
          fullname,
          username,
          email,
          password,
        });
        await user.save();

        const token = user.generate_token();

        res.cookie("x-auth", token).json("saved");
      }
    } else {
      const check_user = await User.findOne({ email: email });

      if (check_user) {
        res.status(400).json({
          msg: "email verified or registered already!!",
        });
      }
      if (!check_user) {
        const user = new User({
          fullname,
          username,
          email,
          password,
        });

        await user.save();

        const token = user.generate_token();

        res.cookie("x-auth", token).json("saved");
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
//////////////////////////////////////// get users
routers.route("/alluser").get(async (req, res) => {
  try {
    const allusers = await User.find({})
      .sort({ createdAt: "desc" })
      .populate("bookings");

    if (!allusers) {
      res.status(400).json({ msg: "no user found" });
    }
    if (allusers) {
      res.status(200).json(allusers);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
////////////GET USER//////////////////paginate
routers.route("/getallusers").get(async (req, res, next) => {
  try {
    let sortArgs = sortArticles(req.body);
    const all_user = await User.find({})
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit);

    res.status(200).json(all_user);
    next();
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

////////////////////////////////////////////// signin users
routers.route("/signin").post(async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
  
    const user_ac = await User.findOne({ email: email }).populate("bookings");
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
    res.status(400).json({ msg: error });
  }
});

routers.route("/getdetails/:id").get(async (req, res) => {
  try {
    const user_ac = await User.findById({ _id: req.params.id }).populate(
      "bookings"
    );

    res.status(200).json(user_ac);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

//////////////////////////////////////////////// modify user content
routers.route("/modifyuser/:id").patch(async (req, res) => {
  try {
    const _id = req.params.id;

    const updated_user = await User.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.status(200).json(updated_user);
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
});

/////////////////////////////////////////////// delete user account

/////////////////////  suspend user
routers.route("/suspenduser/:id").patch(async (req, res) => {
  try {
    const _id = req.params.id;
    console.log({_id})
    const user = await User.findOne({ _id: _id });

    if (!user) {
      res.status(400).json({ msg: "user not found" });
    }
    if (user) {
      const userdata = await User.findByIdAndUpdate(
        { _id },
        {
          $set: {
            ...req.body,
            active: false,
          },
        },
        { new: true }
      );

      await Contactmail(
        user.email,
        "you violated our terms and condition.you can contact our adminstrator to recover your account"
      );
      res.status(200).json({ msg: `Blocked` });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

/////////////////////  unblock user
routers.route("/unblockuser/:id").patch(async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    if (!user) {
      res.status(400).json({ msg: "user not found" });
    }
    if (user) {
      const userdata = await User.findByIdAndUpdate(
        { _id },
        {
          $set: {
            ...req.body,
            active: true,
          },
        },
        { new: true }
      );
      res.status(200).json({ msg: `${userdata.username}` });

      await Contactmail(
        user.email,
        ` hi, ${user.username} your account has been recovered`
      );
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

////////////////// profile0
routers.route("/userprofile").post(async (req, res) => {
  try {
  } catch (error) {}
});

////////////////// Admin profile0
routers.route("/getprofile").get(Checkuser, async (req, res) => {
  try {
    const user = await req.user;

    if (user !== undefined) {
      if(! user.role){
        res.status(200).json(user);
      } else if(user.role==="admin"){
res.status(401).json({msg:"invalid"})
      }
   
    }
    if (user === undefined) {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});


routers.route("/admin_auth").get(Checkuser, async (req, res) => {
  try {
    const user = await req.user;
console.log({user});
    if (user !== undefined) {
      if(user.role==="admin"){
        res.status(200).json(user);
      }else{
        res.status(401).json({msg:"invalid"})
      }
   
    }
    if (user === undefined) {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
////////////////////////////////// delete user

routers.route("/deluser/:id").delete(async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findByIdAndDelete(_id);

    if (user) {
      await Contactmail(
        user.email,
        "sorry, you violated our terms and condition.Your account has been retracted"
      );
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

///////////// send user msg
routers.route("/usermsg").post(async (req, res) => {
  try {
    await Contactmail(req.body.email, req.body.message);

    res.status(200).json({ msg: "message sent" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

///message admin
routers.route("/quest/msg").post(async (req, res) => {
  try {
    await ContactmailClient(req.body.email, req.body.message,req.body.room);

    res.status(200).json({ msg: "message sent" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});


routers.route("/quest/refund").post(async (req, res) => {
  try {
    await RefundRequest(req.body.email, req.body.message,req.body.orderId);

    res.status(200).json({ msg: "message sent" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
/// user reset password

routers.route("/userresetpass/:id").patch(async (req, res) => {
  try {
    const _id = req.params.id;

    const user_a = await User.findById({ _id });
    if (user_a) {
      const matchpassword = await user_a.comparepassword(req.body.oldpass);
      if (matchpassword == false) {
        res.status(400).json({ msg: " Not Permitted ,password mismatch" });
      }
      if (matchpassword == true) {
        const salt = await bcryt.genSalt(10);
        const hash = await bcryt.hash(req.body.newpass, salt);
        const newpass = await User.findOneAndUpdate(
          { _id },
          {
            $set: {
              password: hash,
            },
          },
          { new: true }
        );

        res.status(200).json(newpass);
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routers.route("/userforgotpass").post(async (req, res) => {
  try {
    const email = req.body.email;

    const user_a = await User.findOne({ email });

    if (!user_a) {
      res.status(400).json({ msg: "account not found" });
    }
    if (user_a) {
      const signtoken = jwt.sign({ email }, process.env.ACCOUNT_ACTIVATION, {
        expiresIn: "1d",
      });

      ResetPass(email, signtoken);

      res.status(200).json(signtoken);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
});
//// reset page

routers.route("/passwordforgotreset").patch(async (req, res) => {
  try {
    const { email } = jwt.verify(
      req.body.email,
      process.env.ACCOUNT_ACTIVATION
    );

    const user = await User.findOne({ email: email });

    if (user) {
      const salt = await bcryt.genSalt(10);
      const hash = await bcryt.hash(req.body.password, salt);

      const updated = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hash,
          },
        },
        { new: true }
      );
      res.status(200).json(updated);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
});

routers.route("/sendpasswordresetlink").post(async (req, res) => {
  try {
    const { email } = req.body;
    const check_user = await User.findOne({ email: email });

    if (check_user) {
      const _id = check_user._id;

      const token = jwt.sign({ _id }, process.env.ACCOUNT_ACTIVATION, {
        expiresIn: "1d",
      });
      await ResetPass(email, token);
      res.status(200).json({ msg: "Please check your mail" });
    }
    if (!check_user) {
      res.status(403).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routers.route("/preregisteradmin").post(async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const role = "admin";
    const check_user = await Admin.findOne({ email: email });

    if (check_user) {
      res.status(400).json({
        msg: "email used already!!",
      });
    }
    if (!check_user) {
      const signtoken = jwt.sign(
        { fullname, email, password, role: "admin" },
        process.env.ACCOUNT_ACTIVATION,
        { expiresIn: "1d" }
      );
      await RegisterUser(fullname, email, signtoken);
      res.status(200).json(req.body.fullname);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routers.route("/logadmin").post(async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user_ac = await Admin.findOne({ email: email });

    if (user_ac) {
      if (user_ac.role === "admin") {
        res.status(400).json({ msg: "user blocked" });
      }
      if (user_ac.active === "true") {
        const matchpassword = await user_ac.comparepassword(password);
        if (matchpassword == true) {
          const token = user_ac.generate_token();

          res.cookie("x-admin", token).json(updateD);
        }
        if (matchpassword == false) {
          res.status(400).json({ msg: "Wrong user credentials" });
        }
      }
    }
    if (!user_ac) {
      res.status(400).json({ msg: "user not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

module.exports = routers;
