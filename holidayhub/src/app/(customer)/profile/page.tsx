"use client";

import TopSection from "./components/TopSection";
import ContentArea from "./components/ContentArea";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

/**
 * Customer Profile Page
 * Layout:
 * - Top section (25% height): name + contact info
 * - Bottom section (75% height): sidebar + content area
 */
export default function ProfilePage() {
  const [selected, setSelected] = useState("bookings");

  return (
    <main className="h-screen flex flex-col">
      {/* Top Section */}
      <div className="h-1/4 border-b">
        <TopSection />
      </div>

      {/* Sidebar + Content */}
      <div className="flex h-3/4">
        <Sidebar selected={selected} setSelected={setSelected} />
        <ContentArea selected={selected} />
      </div>
    </main>
  );
}
