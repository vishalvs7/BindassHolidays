"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Page() {
  useEffect(() => {
    async function testFirestore() {
      try {
        // Write a test document
        const docRef = await addDoc(collection(db, "test"), {
          message: "Hello from HolidayHub",
          timestamp: new Date(),
        });
        console.log("Document written with ID:", docRef.id);

        // Read back all docs from "test"
        const snapshot = await getDocs(collection(db, "test"));
        snapshot.forEach((doc) => {
          console.log("Doc:", doc.id, "=>", doc.data());
        });
      } catch (err) {
        console.error("Firestore error:", err);
      }
    }
    testFirestore();
  }, []);

  return <h1>Hello HolidayHub</h1>;
}
