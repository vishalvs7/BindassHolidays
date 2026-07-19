export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed";

export type Gender = "male" | "female" | "other";

export interface TravelerInput {
  full_name: string;
  age: string;
  phone: string;
  gender: Gender | "";
}

export interface CheckoutLeadInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}
