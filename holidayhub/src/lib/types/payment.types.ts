export interface CreateOrderRequest {
  listingType: "package" | "activity";
  listingId: string;
  batchSlotId: string;
  qty: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  travelers: {
    full_name: string;
    age: number;
    phone?: string;
    gender?: "male" | "female" | "other";
  }[];
  // optional: register the lead as a customer (guest checkout if omitted)
  registerPassword?: string;
}

export interface CreateOrderResponse {
  ok: boolean;
  bookingId?: string;
  razorpay?: {
    key: string;
    amount: number;
    currency: string;
    orderId: string;
  };
  error?: string;
}
