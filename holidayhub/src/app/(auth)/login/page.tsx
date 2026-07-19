'use client';

import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginInner() {
  const params = useSearchParams();
  const tab = params.get('tab') === 'register' ? 'register' : 'login';
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <LoginForm initialTab={tab} />
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <Suspense fallback={<div className="h-96" />}>
        <LoginInner />
      </Suspense>
    </div>
  );
}
