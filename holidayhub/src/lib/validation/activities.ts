import { z } from "zod";
import { addressSchema } from "./common";

export const activitySchema = z.object({
  id: z.string(),
  packageId: z.string(),
  name: z.string().min(2),
  heading: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  address: addressSchema.optional(),
  startDate: z.date().optional(),
  finishTime: z.string().optional(),
  reportingDate: z.date().optional(),
  reportingTime: z.string().optional(),
  reportingAddress: addressSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
