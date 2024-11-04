import { Schema } from "mongoose";


const PAYMENT_METHOD= ""
const BookingSchema = new Schema(
    {
      paymentoption: {
        type: String,
      },
      client: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      room: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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