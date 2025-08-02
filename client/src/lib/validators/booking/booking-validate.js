import {z} from "zod";
export const bookingSchema = z.object ({
  fullname: z.string ().min (2, {
    message: "Fullname must be at least 2 characters.",
  }),
  idenCard: z.string ().regex (/^\d{12}$/, {
    message: "Identity Card must be 12 digits.",
  }),
  email: z.string ().email ({
    message: "Invalid email address.",
  }),
  phoneNum: z.string ().regex (/^[0-9\-+]{9,15}$/, {
    message: "Invalid phone number.",
  }),
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

