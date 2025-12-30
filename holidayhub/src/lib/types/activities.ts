import type { Address } from "./common";

export interface Activity {
  id: string;               // Firestore auto-id
  packageId: string;        // reference to Package.id
  name: string;
  heading?: string;
  shortDescription?: string;
  longDescription?: string;
  address?: Address;
  startDate?: Date;
  finishTime?: string;
  reportingDate?: Date;
  reportingTime?: string;
  reportingAddress?: Address;
  createdAt: Date;
  updatedAt?: Date;
}
