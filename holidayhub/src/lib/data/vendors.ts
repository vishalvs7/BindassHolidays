import { db, auth } from "@/firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Vendor } from "@/lib/types/vendors";
import { vendorSchema } from "@/lib/validation/vendors";

export async function getVendorByUid(uid: string): Promise<Vendor | null> {
  const snap = await getDoc(doc(db, "vendors", uid));
  if (!snap.exists()) return null;
  return vendorSchema.parse(snap.data());
}

export async function createVendor(vendor: Vendor) {
  const parsed = vendorSchema.parse(vendor);
  await setDoc(doc(db, "vendors", parsed.uid), parsed);
}

export async function updateVendor(uid: string, data: Partial<Vendor>) {
  const parsed = vendorSchema.partial().parse(data);
  await updateDoc(doc(db, "vendors", uid), parsed);
}
