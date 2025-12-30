import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string(),
  vendorId: z.string(),
  orderId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["upi", "card", "bank_transfer", "external"]),
  status: z.enum(["pending", "paid", "failed", "refunded"]),
  externalRef: z.string().optional(),
  createdAt: z.date(),
});
