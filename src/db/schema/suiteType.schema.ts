import mongoose, { Schema } from 'mongoose';
import {amenitiesTypes, ISuiteType } from '../types/schema.interface';

const suiteTypeSchema = new Schema<ISuiteType>({
  picture: {
    type: [String],
    required: true, 
  },
  price: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0, 
  },
  description: {
    type: String,
    required: true,
  },
  capacity: {
    adult: {
      type: Number,
      required: true,
    },
    children: {
      type: Number,
      required: true,
    },
  },
  mattress: {
    type: String,
  },
  amenities: {
    type: [String],
    enum: Object.values(amenitiesTypes),
    required: true,
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Suite" }],
});

export const SuiteTypeModel = mongoose.model<ISuiteType>("suiteType", suiteTypeSchema);
