export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openRazorpayCheckout(params: {
  key: string;
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onError: (error: string) => void;
}) {
  const options = {
    key: params.key,
    amount: params.amount,
    currency: params.currency,
    order_id: params.orderId,
    name: params.name,
    description: params.description,
    prefill: {
      name: params.prefill?.name ?? "",
      email: params.prefill?.email ?? params.contactEmail,
      contact: params.prefill?.contact ?? params.contactPhone,
    },
    handler: function (response: any) {
      params.onSuccess(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
    },
    modal: {
      ondismiss: function () {
        params.onError("Payment cancelled");
      },
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
