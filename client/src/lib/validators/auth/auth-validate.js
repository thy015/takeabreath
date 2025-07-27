import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password should be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone must be 10 digits and start with 0"),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms of service" }),
  }),
});

export const signInSchema = z.object({
  email: z.email("Invalid email format"),
  password:z.string().min(8, "Password should be at least 8 characters"),
})