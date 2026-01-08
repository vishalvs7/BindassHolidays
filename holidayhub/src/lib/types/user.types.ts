export type UserRole = 'customer' | 'vendor' | 'admin';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends BaseUser {
  role: 'customer';
  bookings: string[]; // Array of booking IDs
  wishlist: string[]; // Array of package/activity IDs
  preferences?: {
    destinations: string[];
    activityTypes: string[];
    budgetRange?: {
      min: number;
      max: number;
    };
  };
}

export interface Vendor extends BaseUser {
  role: 'vendor';
  businessName: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessLogo?: string;
  businessDocuments?: string[]; // URLs to uploaded docs
  isVerified: boolean;
  rating?: number;
  totalBookings: number;
  packageIds: string[];
  activityIds: string[];
}

export interface Admin extends BaseUser {
  role: 'admin';
  permissions: string[];
}

export type User = Customer | Vendor | Admin;