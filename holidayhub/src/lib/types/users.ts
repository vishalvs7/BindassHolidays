import type { Address } from "./common";

export interface Customer {
  uid: string;              // Firebase Auth UID
  name: string;
  phone: string;
  aadhaarNumber?: string;   // handle securely if used
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  email: string;
  address?: Address;
  role: "customer";
  createdAt: Date;
}
