import { db, auth } from "@/firebase/config";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Order } from "@/lib/types/orders";
import { orderSchema } from "@/lib/validation/orders";

export async function listOrdersByVendor(vendorId: string): Promise<Order[]> {
  const q = query(collection(db, "orders"), where("vendorId", "==", vendorId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => orderSchema.parse(d.data()));
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  await updateDoc(doc(db, "orders", id), { status });
}
