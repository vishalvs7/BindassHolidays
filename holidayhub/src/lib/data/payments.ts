import { db, auth } from "@/firebase/config";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Payment } from "@/lib/types/payments";
import { paymentSchema } from "@/lib/validation/payments";

export async function listPaymentsByVendor(vendorId: string): Promise<Payment[]> {
  const q = query(collection(db, "payments"), where("vendorId", "==", vendorId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => paymentSchema.parse(d.data()));
}

export async function createPayment(payment: Payment) {
  const parsed = paymentSchema.parse(payment);
  await setDoc(doc(db, "payments", parsed.id), parsed);
}
