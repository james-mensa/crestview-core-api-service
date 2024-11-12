import { z } from 'zod';
import { AmenitiesType, amenitiesTypes } from '../types/schema.interface';
import mongoose from 'mongoose';


export const SuiteTypeSchema = z.object({
  picture: z.array(z.string()).nonempty(),
  price: z.number().min(0),
  tax: z.number().default(0),
  name: z.string().min(1),
  description: z.string().min(1),
  capacity: z.object({
    adult: z.number().int().min(1),
    children: z.number().int().min(0),
  }),
  mattress: z.string().optional(),
  amenities: z.array(z.enum(Object.values(amenitiesTypes) as [AmenitiesType, ...AmenitiesType[]])).optional(),
  rooms: z.array(z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format"
  })).optional(),
});
export type SuiteTypeDTOType = z.infer<typeof SuiteTypeSchema>;
