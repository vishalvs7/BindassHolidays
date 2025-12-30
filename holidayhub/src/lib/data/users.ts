import { db, auth } from "@/firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Customer } from "@/lib/types/users";
import { customerSchema } from "@/lib/validation/users";

export async function getUserByUid(uid: string): Promise<Customer | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return customerSchema.parse(snap.data());
}

export async function createUser(user: Customer) {
  const parsed = customerSchema.parse(user);
  await setDoc(doc(db, "users", parsed.uid), parsed);
}

export async function updateUser(uid: string, data: Partial<Customer>) {
  const parsed = customerSchema.partial().parse(data);
  await updateDoc(doc(db, "users", uid), parsed);
}
