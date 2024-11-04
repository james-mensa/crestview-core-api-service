import { z } from 'zod';

export const UserSchema = z.object({
  fullname: z.string()
    .min(4, { message: "Full name must be at least 4 characters long" })
    .max(15, { message: "Full name must not exceed 15 characters" }),
  email: z.string()
    .email({ message: "Invalid email format" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type UserDTO = z.infer<typeof UserSchema>;
