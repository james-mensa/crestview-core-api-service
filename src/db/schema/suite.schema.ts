
import  mongoose, { Schema } from 'mongoose';
import { ISuite, SuiteHousekeepingStatus, SuiteStatus } from '../interfaces/schema.interface';



const suiteSchema = new Schema<ISuite>(
  {
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookings",
      },
    ],
    suiteTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "suiteTypes",
    },
    roomNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(SuiteStatus),
      default:SuiteStatus.AVAILABLE
    },
    floorNumber: {
      type: Number,
    },
    housekeepingStatus: {
      type: String,
      enum: Object.values(SuiteHousekeepingStatus),
      default:SuiteHousekeepingStatus.CLEAN
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
export const  suiteModel = mongoose.model<ISuite>("rooms", suiteSchema);