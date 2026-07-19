'use client';

import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export default function CustomerRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoginForm initialTab="register" />
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Want to list your trips?{' '}
            <Link href="/register/vendor" className="text-primary-600 hover:text-primary-700 font-medium">
              Join as Vendor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
