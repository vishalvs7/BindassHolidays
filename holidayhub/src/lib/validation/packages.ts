import { z } from "zod";
import { addressSchema, entityStatusSchema } from "./common";

export const packageSchema = z.object({
  id: z.string(),
  vendorId: z.string(),
  name: z.string().min(2),
  heading: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  address: addressSchema.optional(),
  startDate: z.date().optional(),
  finishTime: z.string().optional(),        // "HH:mm" or make date if needed
  reportingDate: z.date().optional(),
  reportingTime: z.string().optional(),
  reportingAddress: addressSchema.optional(),
  images: z.array(z.string().url()).optional(),
  status: entityStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
