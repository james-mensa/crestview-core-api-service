const bcryt = require("bcrypt");
const mongoose = require("mongoose");



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
