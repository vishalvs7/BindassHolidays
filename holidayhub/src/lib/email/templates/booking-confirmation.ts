export function bookingConfirmationEmail(params: {
  contactName: string;
  listingTitle: string;
  departAt: string;
  returnAt: string;
  travelers: { full_name: string }[];
  totalAmount: number;
  bookingId: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <tr><td style="background:#7c3aed;padding:24px 32px;text-align:center">
        <h1 style="margin:0;font-size:20px;color:#fff">Booking Confirmed!</h1>
      </td></tr>
      <tr><td style="padding:24px 32px">
        <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6">Hi <strong>${params.contactName}</strong>, your trip is confirmed.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#374151">
          <tr><td style="padding:6px 0;color:#6b7280">Trip</td><td style="padding:6px 0;font-weight:600">${params.listingTitle}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Departure</td><td style="padding:6px 0;font-weight:600">${new Date(params.departAt).toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Return</td><td style="padding:6px 0;font-weight:600">${new Date(params.returnAt).toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Guests</td><td style="padding:6px 0;font-weight:600">${params.travelers.length}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Amount Paid</td><td style="padding:6px 0;font-weight:600;color:#7c3aed">₹${params.totalAmount.toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Booking ID</td><td style="padding:6px 0;font-family:monospace;font-size:12px">${params.bookingId.slice(0, 8)}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:16px">
          A detailed booking PDF is attached. Show it at check-in.
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
