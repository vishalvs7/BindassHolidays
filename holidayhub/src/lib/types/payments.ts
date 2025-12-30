export type PaymentMethod = "upi" | "card" | "bank_transfer" | "external";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  id: string;               // Firestore auto-id
  vendorId: string;         // Vendor.uid
  orderId: string;          // Order.id
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  externalRef?: string;     // payment history from outside
  createdAt: Date;
}
