export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type EntityStatus = "active" | "inactive" | "archived";

export type VerificationStatus = "pending_verification" | "verified" | "rejected";
