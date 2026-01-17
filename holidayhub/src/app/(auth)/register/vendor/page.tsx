import { VendorRegisterForm } from '@/components/auth/vendor-register-form';
import Link from 'next/link';

export default function VendorRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-700">Bindass Holiday</h1>
          </Link>
          <p className="text-gray-600 mt-2">Grow your tour business with us</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <VendorRegisterForm />
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-primary-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Why Join as Vendor?</h3>
          <ul className="space-y-3 text-sm text-primary-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Reach thousands of travelers
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Secure payment processing
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Business analytics dashboard
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Dedicated support team
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}