export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;               // Firestore auto-id
  userId: string;           // Customer.uid
  vendorId: string;         // Vendor.uid
  packageId: string;        // Package.id
  status: BookingStatus;
  quantity?: number;
  price?: number;           // per unit
  total?: number;           // derived: quantity * price
  createdAt: Date;
  updatedAt?: Date;
}
