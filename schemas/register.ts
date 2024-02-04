import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid Email",
  }),
  name: z.string().min(1, {
    message: "Invalid Name",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
