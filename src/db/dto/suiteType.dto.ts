import { z } from 'zod';
import { AmenitiesTypes } from '../types/schema.interface';

export const SuitTypeSchema = z.object({
  picture: z.array(z.string()).optional(), 
  price: z.number().positive({ message: "Price must be a positive number" }),
  name: z.string().min(1, { message: "Name is required" }), 
  description: z.string().optional(), 
  capacity: z.object({
    adult: z.number().max(5).positive({ message: "Adult capacity must be a positive number" }), 
    children: z.number().max(5).nonnegative({ message: "Children capacity must be a non-negative number" }),
  }), 
  mattress: z.string().optional(),
  amenities: z.array(z.enum(Object.values(AmenitiesTypes) as [string, ...string[]])).optional()
});

export type SuitTypeDTO = z.infer<typeof SuitTypeSchema>;
