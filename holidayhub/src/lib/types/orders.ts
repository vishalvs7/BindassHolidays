export type OrderStatus = "in_progress" | "uncompleted" | "completed" | "refunded";

export interface Order {
  id: string;               // Firestore auto-id
  vendorId: string;         // Vendor.uid
  packageId: string;        // Package.id
  userId: string;           // Customer.uid
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}
