require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
const { Admin } = require("../models/users");

exports.AuthSession = async (req, res, next) => {
  try {
    let checker = req.cookies["refreshToken"];
    if (checker) {
      const datas = jwt.verify(
        checker,
        process.env.DB_SECRET,
        async function (err, decoded) {
          if (decoded) { 
            const user = await User.findOne({ _id: decoded._id })
              .populate({
                path: "bookings",
                populate: { path: "room" },
              })
              .populate("conference")
              .populate("special_date");
            if (user) {
              
              res.locals.userData = user;
            }
            else{
              const user_ac = await Admin.findOne({  _id: decoded._id  })
              res.locals.userData = user_ac;
            }
          }
          next();
        }
      );
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
};

exports.isAuthorized = async (req, res, next) => {
  const user = res.locals.userData;
  req.user = user;
  next();
};
