import { db, auth } from "@/firebase/config";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Package } from "@/lib/types/packages";
import { packageSchema } from "@/lib/validation/packages";

export async function listPackagesByVendor(vendorId: string): Promise<Package[]> {
  const q = query(collection(db, "packages"), where("vendorId", "==", vendorId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => packageSchema.parse(d.data()));
}

export async function createPackage(pkg: Package) {
  const parsed = packageSchema.parse(pkg);
  await setDoc(doc(db, "packages", parsed.id), parsed);
}

export async function updatePackage(id: string, data: Partial<Package>) {
  const parsed = packageSchema.partial().parse(data);
  await updateDoc(doc(db, "packages", id), parsed);
}
