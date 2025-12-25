"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";

export default function JoinAsVendorPage() {
  const [businessName, setBusinessName] = useState("");
  const router = useRouter();

  const handleJoinVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await updateDoc(doc(db, "users", uid), { role: "vendor" });
    await setDoc(doc(db, "vendors", uid), {
      businessName,
      createdAt: new Date(),
    });
    router.push("/(vendor)/dashboard");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold">Join as Vendor</h2>
      <form onSubmit={handleJoinVendor} className="flex flex-col gap-2 w-64">
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-purple-500 text-white p-2 rounded">
          Become Vendor
        </button>
      </form>
    </main>
  );
}
