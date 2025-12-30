import { z } from "zod";

export const addressSchema = z.object({
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2),
});

export const entityStatusSchema = z.enum(["active", "inactive", "archived"]);

export const verificationStatusSchema = z.enum([
  "pending_verification",
  "verified",
  "rejected",
]);
