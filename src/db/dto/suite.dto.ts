import { z } from "zod";

const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;

export const SuiteSchema = z.object({
  accessToken: z.string(),
//   booking: z.array(z.string().regex(ObjectIdRegex, { message: "Invalid MongoDB ObjectId" })),
//   roomType: z.string().regex(ObjectIdRegex, {message: "Invalid MongoDB ObjectId",}),
  roomNumber: z.string().min(1, { message: "required" }),
});

export type SuiteDTO = z.infer<typeof SuiteSchema>;
