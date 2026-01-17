import { CustomerRegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';

export default function CustomerRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-700">Bindass Holiday</h1>
          </Link>
          <p className="text-gray-600 mt-2">Join as a traveler</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <CustomerRegisterForm />
        </div>

        {/* Vendor Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Want to list your tours?{' '}
            <Link href="/register/vendor" className="text-primary-600 hover:text-primary-700 font-medium">
              Join as Vendor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}