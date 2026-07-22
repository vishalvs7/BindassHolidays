'use client';

import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export default function CustomerRegisterPage() {
  return (
    <>
      <LoginForm initialTab="register" />
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Want to list your trips?{' '}
          <Link href="/register/vendor" className="text-primary-600 hover:text-primary-700 font-medium">
            Join as Vendor
          </Link>
        </p>
      </div>
    </>
  );
}
