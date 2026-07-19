declare module "razorpay" {
  interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt?: string;
    status?: string;
    [key: string]: unknown;
  }
  export default class Razorpay {
    constructor(config: { key_id: string; key_secret: string });
    orders: {
      create(params: {
        amount: number;
        currency: string;
        receipt?: string;
        payment_capture?: 0 | 1;
        notes?: Record<string, string>;
      }): Promise<RazorpayOrder>;
    };
  }
}
