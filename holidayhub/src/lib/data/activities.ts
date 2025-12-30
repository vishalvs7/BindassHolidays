import { db, auth } from "@/firebase/config";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Activity } from "@/lib/types/activities";
import { activitySchema } from "@/lib/validation/activities";

export async function listActivitiesByPackage(packageId: string): Promise<Activity[]> {
  const q = query(collection(db, "activities"), where("packageId", "==", packageId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => activitySchema.parse(d.data()));
}

export async function createActivity(activity: Activity) {
  const parsed = activitySchema.parse(activity);
  await setDoc(doc(db, "activities", parsed.id), parsed);
}

export async function updateActivity(id: string, data: Partial<Activity>) {
  const parsed = activitySchema.partial().parse(data);
  await updateDoc(doc(db, "activities", id), parsed);
}
