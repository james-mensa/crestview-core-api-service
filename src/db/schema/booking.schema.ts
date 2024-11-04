import { Schema, model } from "mongoose";
import { IBooking, PaymentMethods } from "../types/schema.interface";


const BookingSchema = new Schema(
  {
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethods),
      required: [true, "Payment method is required"],
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    suiteId: {
      type: Schema.Types.ObjectId,
      ref: "Suite",
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    ratingId: {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price cannot be negative"],
    },
    taxAmount: {
      type: Number,
      required: true,
      min: [0, "Tax amount cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    finalPrice: {
      type: Number,
      required: true,
      min: [0, "Final price cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
    },

  },
  { timestamps: true }
);

export default BookingSchema;





export const Booking = model<IBooking>("Booking", BookingSchema);
