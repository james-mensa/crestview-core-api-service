import {
  ISuite,
  SuiteHousekeepingStatus,
  SuiteStatus,
} from "@db/interfaces/schema.interface";
import mongoose from "mongoose";
import { z } from "zod";

export const SuiteSchema = z.object({
  bookings: z.array(
    z.custom<mongoose.Types.ObjectId>(
      (val) => isValidObjectId(val),
      { message: "Invalid ObjectId format" }
    )
    ).optional(),
  suiteTypeId:z.custom<mongoose.Types.ObjectId>(
    (val) => isValidObjectId(val),
    { message: "Invalid ObjectId format" }
  ),
  roomNumber: z.string().min(1, { message: "Room number is required" }),
  status: z.enum(Object.values(SuiteStatus) as [SuiteStatus, ...SuiteStatus[]]).optional(),
  floorNumber: z.number().int().optional(),
  housekeepingStatus: z.enum(
    Object.values(SuiteHousekeepingStatus) as [SuiteHousekeepingStatus,...SuiteHousekeepingStatus[]]
  ).optional(),
  tags: z.array(z.string()).optional(),
});

export type SuiteDTO = z.infer<typeof SuiteSchema>;
export const suiteParseBody = (body:  ISuite) => {
  // if(body.tags) body.tags = JSON.parse(body.tags)  
  return body;
};

const isValidObjectId = (val: string): boolean => mongoose.Types.ObjectId.isValid(val);
