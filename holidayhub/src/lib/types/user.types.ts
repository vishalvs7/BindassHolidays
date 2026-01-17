export type UserRole = 'customer' | 'vendor' | 'admin';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  businessName?: string;
  createdAt: Date;
}

export interface CustomerProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  profileImage?: string;
  preferences?: {
    destinations: string[];
    activities: string[];
    budgetRange: {
      min: number;
      max: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorProfile {
  userId: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: 'tour-operator' | 'activity-provider' | 'both';
  registrationNumber?: string;
  businessAddress?: string;
  profileImage?: string;
  businessLogo?: string;
  description?: string;
  rating?: number;
  totalBookings?: number;
  createdAt: Date;
  updatedAt: Date;
}