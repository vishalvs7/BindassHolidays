"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Bindass Holiday</h1>
      <Link href="/signup">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign Up</button>
      </Link>
      <Link href="/login">
        <button className="px-4 py-2 bg-green-500 text-white rounded">Login</button>
      </Link>
      <Link href="/joinasvendor">
        <button className="px-4 py-2 bg-purple-500 text-white rounded">Join as Vendor</button>
      </Link>
    </main>
  );
}
