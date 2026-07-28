export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString("en-IN")}</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Information We Collect</h2>
        <p>
          When you book a trip through HolidayHub, we collect your name, email address, phone number,
          and travel companion details. This information is necessary to process your booking and
          communicate trip updates.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">How We Use Your Information</h2>
        <p>
          We use your information to process bookings, send trip confirmations, and provide customer
          support. We do not sell or share your personal data with third parties for marketing purposes.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Data Security</h2>
        <p>
          Your data is stored securely using industry-standard encryption. Payment processing is handled
          by Razorpay and we do not store your payment card details.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact Us</h2>
        <p>
          For privacy-related inquiries, please contact us at{" "}
          <a href="mailto:privacy@holidayhub.in" className="text-primary-600 hover:underline">
            privacy@holidayhub.in
          </a>
        </p>
      </div>
    </div>
  );
}
