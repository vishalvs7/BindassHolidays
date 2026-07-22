export function welcomeEmail(name: string): string {
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
          You're all set. Start exploring weekend trips curated for the Indian working professional.
        </p>
      </td></tr>
      <tr><td style="padding:24px 32px;text-align:center">
        <a href="https://holidayhub.in/packages"
           style="display:inline-block;padding:12px 32px;background:#7c3aed;color:#fff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600">
          Browse Trips
        </a>
      </td></tr>
      <tr><td style="padding:0 32px 24px;text-align:center;font-size:12px;color:#9ca3af">
        Depart Friday night · Return Monday morning · Zero leaves needed
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
