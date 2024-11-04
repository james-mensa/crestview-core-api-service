
import  mongoose, { Schema } from 'mongoose';
import { ISuite } from '../types/schema.interface';
const suiteSchema =new Schema<ISuite>({
  booking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
    },
  ],
  
  suiteType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "SuiteType",
  },
  roomNumber: {
    type: String,
    required: true,
  },
});
export const  suiteModel = mongoose.model<ISuite>("Suite", suiteSchema);