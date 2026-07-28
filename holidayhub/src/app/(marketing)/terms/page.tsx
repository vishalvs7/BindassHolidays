export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString("en-IN")}</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Booking Terms</h2>
        <p>
          All bookings are subject to availability. Prices listed are per person unless stated otherwise.
          GST (5%) is included in the displayed price.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Cancellation Policy</h2>
        <p>
          Cancellations made 7 days or more before the departure date are eligible for a full refund.
          Cancellations within 7 days of departure are non-refundable. Contact support for特殊情况.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Traveler Responsibilities</h2>
        <p>
          Travelers are responsible for carrying valid ID proof during the trip. HolidayHub is not
          liable for issues arising from inaccurate traveler information provided during booking.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact Us</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a href="mailto:legal@holidayhub.in" className="text-primary-600 hover:underline">
            legal@holidayhub.in
          </a>
        </p>
      </div>
    </div>
  );
}
