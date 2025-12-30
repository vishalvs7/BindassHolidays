import { z } from "zod";

export const orderSchema = z.object({
  id: z.string(),
  vendorId: z.string(),
  packageId: z.string(),
  userId: z.string(),
  status: z.enum(["in_progress", "uncompleted", "completed", "refunded"]),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
