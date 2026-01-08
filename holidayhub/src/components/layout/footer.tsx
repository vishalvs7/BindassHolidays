export function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Bindass Holiday</h3>
            <p className="text-sm text-muted-foreground">
              Multi-vendor travel platform connecting travelers with verified tour operators.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Travelers</h4>
            <ul className="space-y-2 text-sm">
              <li>Browse Packages</li>
              <li>Find Activities</li>
              <li>Book Instantly</li>
              <li>Corporate Travel</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li>List Your Tours</li>
              <li>Manage Bookings</li>
              <li>Earn More</li>
              <li>Vendor Dashboard</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Bindass Holiday. All rights reserved.
        </div>
      </div>
    </footer>
  );
}