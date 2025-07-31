import {z} from "zod";

export const bookingSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullname: z.string().min(1, "Name is required"),
  idenCard: z.string().regex(/^\d{12}$/, "Identity card must be exactly 12 digits"),
  phoneNum: z.string().min(9, "Phone number must be at least 9 characters").max(15, "Phone number too long"),
  dob: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Invalid date of birth",
  }),
  gender: z.enum(["male", "female", "unknown"], {
    required_error: "Must select a gender",
  }),
  paymentMethod: z.enum(["paypal"], {
    required_error: "Must select a payment method",
  }),
})
