import { redirect } from 'next/navigation';

// This makes /customer redirect to customer/bookings
export default function CustomerPage() {
  redirect('/customer/bookings');
}