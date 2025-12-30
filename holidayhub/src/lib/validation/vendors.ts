import { z } from "zod";
import { addressSchema, verificationStatusSchema } from "./common";

export const vendorSchema = z.object({
  uid: z.string(),
  name: z.string().min(2),
  aadhaarNumber: z.string().length(12).optional(),
  phone: z.string().regex(/^[0-9]{10}$/),
  email: z.string().email(),
  anyOtherId: z.string().optional(),
  gstNumber: z.string().optional(),
  address: addressSchema.optional(),
  businessName: z.string().min(2),
  businessCreatedAt: z.date(),
  status: verificationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
