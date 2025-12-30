"use client";

import TopSection from "./components/TopSection";
import Sidebar from "./components/Sidebar";
import ContentArea from "./components/ContentArea";
import { useState } from "react";

/**
 * Vendor Dashboard Page
 * Layout:
 * - Top section (25% height): business name + contact info
 * - Bottom section (75% height): sidebar + content area
 */
export default function DashboardPage() {
  const [selected, setSelected] = useState("packages");

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
