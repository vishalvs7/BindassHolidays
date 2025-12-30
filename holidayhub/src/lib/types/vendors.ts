import type { Address, VerificationStatus } from "./common";

export interface Vendor {
  uid: string;              // Firebase Auth UID
  name: string;             // Contact person
  aadhaarNumber?: string;
  phone: string;
  email: string;
  anyOtherId?: string;      // PAN, DL, etc.
  gstNumber?: string;
  address?: Address;
  businessName: string;
  businessCreatedAt: Date;
  status: VerificationStatus;
  createdAt: Date;
  updatedAt?: Date;
}
