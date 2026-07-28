export function welcomeEmail(name: string, siteUrl: string = "https://holidayhub.in"): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <tr><td style="padding:32px 32px 0;text-align:center">
        <h1 style="margin:0;font-size:24px;color:#1e1b4b">Welcome to HolidayHub!</h1>
        <p style="margin:12px 0 0;color:#6b7280;font-size:14px;line-height:1.6">
          Hi <strong>${name}</strong>,<br>
          Your account has been created. Set your password below to access your bookings and manage your trips.
        </p>
      </td></tr>
      <tr><td style="padding:24px 32px;text-align:center">
        <a href="${siteUrl}/forgot-password"
           style="display:inline-block;padding:12px 32px;background:#7c3aed;color:#fff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600">
          Set Your Password
        </a>
        <p style="margin:16px 0 0;color:#9ca3af;font-size:12px">
          Use the same email you booked with: <strong>${name}</strong>
        </p>
      </td></tr>
      <tr><td style="padding:0 32px 24px;text-align:center;font-size:12px;color:#9ca3af">
        After setting your password, log in to view all your bookings.
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
