const bcryt = require("bcrypt");
const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const user_Schemas = mongoose.Schema(
  {
    fullname: {
      type: String,
      min: 4,
      max: 15,
    },
    username: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookings",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    special_date: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rooftop",
      },
    ],
    conference: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conference",
      },
    ],
  },
  { timestamps: true }
);

/////////////////////// admin

const Admin_schm = mongoose.Schema(
  {
    fullname: {
      type: String,
      min: 4,
      max: 15,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

user_Schemas.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcryt.genSalt(10);
    const hash = await bcryt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});
//// all methodsss***********************************************************************

user_Schemas.methods.comparepassword = async function (inputpassword) {
  const user = this;
  const match = await bcryt.compare(inputpassword, user.password);
  return match;
};

////////////////gmail verify user////////////////
user_Schemas.methods.usergmailverify = function () {
  const user = this;
  const userId = { _id: user._id.toHexString() };
  const token = jwt.sign(userId, process.env.DB_SECRET, { expiresIn: "1d" });
  return token;
};

//////////// generate tokens

user_Schemas.methods.generate_token = function () {
  const user = this;
  const userId = { _id: user._id.toHexString() };

  const token = jwt.sign(userId, process.env.DB_SECRET, { expiresIn: "1d" });
  return token;
};

///////////////////////////////////////////////admin
Admin_schm.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcryt.genSalt(10);
    const hash = await bcryt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});
//// all methodsss***********************************************************************

Admin_schm.methods.comparepassword = async function (inputpassword) {
  const user = this;
  const match = await bcryt.compare(inputpassword, user.password);
  return match;
};

Admin_schm.methods.generate_token = function () {
  const user = this;
  const userId = { _id: user._id.toHexString(), email: user.email };
  const token = jwt.sign(userId, process.env.DB_SECRET, { expiresIn: "1d" });
  return token;
};
Admin_schm.methods.mailverify = function () {
  const user = this;
  const userId = { _id: user._id.toHexString() };
  const token = jwt.sign(userId, process.env.DB_SECRET, { expiresIn: "1d" });
  return token;
};
/////////////////////////////////

const Admin = mongoose.model("Admin", Admin_schm);
const User = mongoose.model("users", user_Schemas);

module.exports = {
  User,
  Admin,
};
