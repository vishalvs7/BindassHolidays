"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BrowseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <AlertCircle size={64} className="text-red-300" />
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 max-w-md text-center text-sm text-gray-500">
        {error.message || "We couldn't load this page right now. Please try again."}
      </p>
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
