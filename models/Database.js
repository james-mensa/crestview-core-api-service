const bcryt = require("bcrypt");
const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  image: {
    type: String,
  },
  booking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
    },
  ],
  price: {
    type: Number,
  },
  room_type: {
    type: String,
  },
  room_numer: {
    type: String,
  },
  alias: {
    type: String,
  },
  extra: [{ type: String }],

  rate_s: {
    type: Number,
    default: false,
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratings",
    },
  ],
  description: {
    type: String,
  },

  capacity: {
    type: Number,
  },
  aircondition: {
    type: Boolean,
    default: false,
  },
  meals: {
    type: String,
  },
  mattress: {
    type: String,
  },
});

const RoomTypeSchema = mongoose.Schema({
  image: {
    type: String,
  },
  price: {
    type: Number,
  },
  room_type: {
    type: String,
  },
  room_numer: {
    type: String,
  },
  alias: {
    type: String,
  },
  extra: [{ type: String }],

  rate_s: {
    type: Number,
    default: false,
  },

  description: {
    type: String,
  },

  capacity: {
    type: Number,
  },
  aircondition: {
    type: Boolean,
    default: false,
  },
  meals: {
    type: String,
  },
  mattress: {
    type: String,
  },
});
const BookingSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
    },
    paymentoption: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    customername: {
      type: String,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
    },
    room_id: {
      type: String,
    },
    room_number: {
      type: String,
    },
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
    rateme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratings",
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const ConferenceSchema = mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
    },
    paymentoption: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    customername: {
      type: String,
    },

    date: {
      type: Date,
    },
    equipement: [
      {
        type: String,
      },
    ],

    members: {
      type: Number,
    },

    from: {
      type: String,
    },

    to: {
      type: String,
    },

    price: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const RooftopSchema = mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
    },
    paymentoption: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    customername: {
      type: String,
    },

    date: {
      type: String,
    },
    members: {
      type: Number,
    },
    from: {
      type: String,
    },

    to: {
      type: String,
    },

    price: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);
const ratemeSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    message: {
      type: String,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
    },
    rate: {
      type: Number,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Testimonial = mongoose.Schema({
  testimony: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratings",
    },
  ],
});

const RoomModel = mongoose.model("rooms", RoomSchema);
const BookingModel = mongoose.model("bookings", BookingSchema);
const RatemeModel = mongoose.model("ratings", ratemeSchema);
const TestimonialModel = mongoose.model("testimony", Testimonial);
const RoomTypeModel = mongoose.model("roomtype", RoomTypeSchema);
const ConferenceModel = mongoose.model("conference", ConferenceSchema);
const RooftopModel = mongoose.model("rooftop", RooftopSchema);
module.exports = {
  RooftopModel,
  RoomModel,
  BookingModel,
  RatemeModel,
  TestimonialModel,
  RoomTypeModel,
  ConferenceModel,
};
