import type { Address, EntityStatus } from "./common";

export interface Package {
  id: string;               // Firestore auto-id
  vendorId: string;         // references Vendor.uid
  name: string;
  heading?: string;
  shortDescription?: string;
  longDescription?: string;
  address?: Address;
  startDate?: Date;
  finishTime?: string;      // "HH:mm" or use Date if date-bound
  reportingDate?: Date;
  reportingTime?: string;   // "HH:mm" or use Date if date-bound
  reportingAddress?: Address;
  images?: string[];        // URLs
  status: EntityStatus;     // "active" | "inactive" | "archived"
  createdAt: Date;
  updatedAt?: Date;
}
