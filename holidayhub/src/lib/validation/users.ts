import { z } from "zod";
import { addressSchema } from "./common";

export const customerSchema = z.object({
  uid: z.string(),
  name: z.string().min(2),
  phone: z.string().regex(/^[0-9]{10}$/),
  aadhaarNumber: z.string().length(12).optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  email: z.string().email(),
  address: addressSchema.optional(),
  role: z.literal("customer"),
  createdAt: z.date(),
});
