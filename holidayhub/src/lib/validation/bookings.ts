import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  vendorId: z.string(),
  packageId: z.string(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  quantity: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  total: z.number().positive().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
