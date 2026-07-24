import { create } from 'zustand';
import { getBrowserClient } from '@/lib/supabase/client';
import { fetchProfile, fetchVendor, toUserData, type SupabaseVendor } from '@/lib/supabase/auth-helper';
import type { UserData, UserRole } from '@/lib/types/user.types';

export type AuthUser = {
  id: string;
  email: string | null;
};

export type VendorData = {
  businessName?: string;
  businessType?: 'tour-operator' | 'activity-provider' | 'both';
  contactPerson?: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
  gstNumber?: string;
  businessAddress?: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected';
  bankAccount?: string;
  upiId?: string;
  notificationPreferences?: Record<string, boolean>;
};

interface AuthState {
  user: AuthUser | null;
  userData: UserData | null;
  vendorData: VendorData | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  registerCustomer: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  registerVendorStep1: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  registerVendorStep2: (data: VendorData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
  updateProfile: (data: { name?: string; phone?: string; avatar_url?: string; bio?: string; date_of_birth?: string }) => Promise<void>;
  updateVendor: (data: Record<string, unknown>) => Promise<void>;
}

const toMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
};

const dashboardFor = (role: UserRole): string => {
  switch (role) {
    case 'vendor':
      return '/vendor/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/customer/dashboard';
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  vendorData: null,
  loading: false,
  initialized: false,
  error: null,

  init: async () => {
    const supabase = getBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      const userData = profile ? toUserData(profile) : null;
      set({
        user: { id: session.user.id, email: session.user.email ?? null },
        userData,
        vendorData: userData?.role === 'vendor' ? await fetchVendor(session.user.id).then(mapVendor) : null,
      });
    }

    // Listen for future auth changes (login/logout/token refresh)
    supabase.auth.onAuthStateChange(async (_event: string, session: { user: { id: string; email: string | null } } | null) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        const userData = profile ? toUserData(profile) : null;
        set({
          user: { id: session.user.id, email: session.user.email ?? null },
          userData,
          vendorData: userData?.role === 'vendor' ? await fetchVendor(session.user.id).then(mapVendor) : null,
        });
      } else {
        set({ user: null, userData: null, vendorData: null });
      }
    });

    set({ initialized: true });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        set({
          user: { id: data.user.id, email: data.user.email ?? null },
          userData: profile ? toUserData(profile) : null,
        });
      }
    } catch (error) {
      set({ error: toMessage(error, 'Login failed') });
    } finally {
      set({ loading: false });
    }
  },

  registerCustomer: async (data) => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name, role: 'customer', phone: data.phone ?? null },
        },
      });
      if (error) throw error;
      if (authData.user) {
        const profile = await fetchProfile(authData.user.id);
        set({
          user: { id: authData.user.id, email: authData.user.email ?? null },
          userData: profile ? toUserData(profile) : null,
        });
      }
    } catch (error) {
      set({ error: toMessage(error, 'Registration failed') });
    } finally {
      set({ loading: false });
    }
  },

  registerVendorStep1: async (data) => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name, role: 'vendor', phone: data.phone },
        },
      });
      if (error) throw error;
      if (authData.user) {
        const profile = await fetchProfile(authData.user.id);
        set({
          user: { id: authData.user.id, email: authData.user.email ?? null },
          userData: profile ? toUserData(profile) : null,
        });
        // Create the initial vendor row (step 2 fills the rest)
        await supabase.from('vendors').insert({
          id: authData.user.id,
          contact_person: data.name,
          phone: data.phone,
          email: data.email,
        });
      }
    } catch (error) {
      set({ error: toMessage(error, 'Vendor registration failed') });
    } finally {
      set({ loading: false });
    }
  },

  registerVendorStep2: async (data) => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const userId = get().user?.id;
      if (!userId) throw new Error('Session expired. Please log in again.');
      const { error } = await supabase
        .from('vendors')
        .update({
          business_name: data.businessName ?? null,
          business_type: data.businessType ?? null,
          registration_number: data.registrationNumber ?? null,
          gst_number: data.gstNumber ?? null,
          business_address: data.businessAddress ?? null,
          logo_url: data.logoUrl ?? null,
          banner_url: data.bannerUrl ?? null,
          description: data.description ?? null,
        })
        .eq('id', userId);
      if (error) throw error;
      const vendor = await fetchVendor(userId);
      set({ vendorData: vendor ? mapVendor(vendor) : null });
    } catch (error) {
      set({ error: toMessage(error, 'Could not save business details') });
    } finally {
      set({ loading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
          // Google only returns name/email; role defaults to 'customer'
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (error) {
      set({ error: toMessage(error, 'Google sign-in failed') });
      set({ loading: false });
    }
  },

  logout: async () => {
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    set({ user: null, userData: null, vendorData: null });
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/reset`,
      });
      if (error) throw error;
    } catch (error) {
      set({ error: toMessage(error, 'Failed to send reset email') });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const userId = get().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
        })
        .eq('id', userId);

      if (error) throw error;

      // Refresh profile data
      const profile = await fetchProfile(userId);
      if (profile) {
        set({ userData: toUserData(profile) });
      }
    } catch (error) {
      set({ error: toMessage(error, 'Failed to update profile') });
    } finally {
      set({ loading: false });
    }
  },

  updateVendor: async (data) => {
    set({ loading: true, error: null });
    try {
      const supabase = getBrowserClient();
      const userId = get().user?.id;
      if (!userId) throw new Error('Not authenticated');

      // Build update payload, only including defined keys
      const payload: Record<string, unknown> = {};
      const keyMap: Record<string, string> = {
        business_name: 'business_name',
        contact_person: 'contact_person',
        phone: 'phone',
        email: 'email',
        business_type: 'business_type',
        registration_number: 'registration_number',
        gst_number: 'gst_number',
        business_address: 'business_address',
        logo_url: 'logo_url',
        banner_url: 'banner_url',
        description: 'description',
        bank_account: 'bank_account',
        upi_id: 'upi_id',
        notification_preferences: 'notification_preferences',
      };

      for (const [camelKey, dbKey] of Object.entries(keyMap)) {
        const val = data[camelKey];
        if (val !== undefined) payload[dbKey] = val;
      }

      if (Object.keys(payload).length === 0) {
        set({ loading: false });
        return;
      }

      const { error } = await supabase
        .from('vendors')
        .update(payload)
        .eq('id', userId);

      if (error) throw error;

      // Refresh vendor data
      const vendor = await fetchVendor(userId);
      set({ vendorData: vendor ? mapVendor(vendor) : null });
    } catch (error) {
      set({ error: toMessage(error, 'Failed to update vendor details') });
    } finally {
      set({ loading: false });
    }
  },
}));

function mapVendor(v: SupabaseVendor | null): VendorData | null {
  if (!v) return null;
  return {
    businessName: v.business_name ?? undefined,
    businessType: v.business_type ?? undefined,
    contactPerson: v.contact_person ?? undefined,
    phone: v.phone ?? undefined,
    email: v.email ?? undefined,
    registrationNumber: v.registration_number ?? undefined,
    gstNumber: v.gst_number ?? undefined,
    businessAddress: v.business_address ?? undefined,
    logoUrl: v.logo_url ?? undefined,
    bannerUrl: v.banner_url ?? undefined,
    description: v.description ?? undefined,
    status: v.status,
    bankAccount: v.bank_account ?? undefined,
    upiId: v.upi_id ?? undefined,
    notificationPreferences: v.notification_preferences ?? undefined,
  };
}

export { dashboardFor };
