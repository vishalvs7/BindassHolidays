import { db, auth } from "@/firebase/config";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Booking } from "@/lib/types/bookings";
import { bookingSchema } from "@/lib/validation/bookings";

export async function listBookingsByUser(userId: string): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => bookingSchema.parse(d.data()));
}

export async function createBooking(booking: Booking) {
  const parsed = bookingSchema.parse(booking);
  await setDoc(doc(db, "bookings", parsed.id), parsed);
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  await updateDoc(doc(db, "bookings", id), { status });
}
