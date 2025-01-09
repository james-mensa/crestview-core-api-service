import { z } from "zod";
export const SuiteSchema = z.object({
  accessToken: z.string(),

  roomNumber: z.string().min(1, { message: "required" }),
});

export type SuiteDTO = z.infer<typeof SuiteSchema>;
