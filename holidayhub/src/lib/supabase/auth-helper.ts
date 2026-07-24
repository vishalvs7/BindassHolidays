import { getBrowserClient } from '@/lib/supabase/client';
import type { UserData, UserRole } from '@/lib/types/user.types';

export interface SupabaseProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface SupabaseVendor {
  id: string;
  business_name: string | null;
  business_type: 'tour-operator' | 'activity-provider' | 'both' | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  registration_number: string | null;
  gst_number: string | null;
  business_address: string | null;
  logo_url: string | null;
  banner_url: string | null;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  bank_account: string | null;
  upi_id: string | null;
  notification_preferences: Record<string, boolean> | null;
  created_at: string;
  updated_at: string;
}

export function toUserData(p: SupabaseProfile): UserData {
  return {
    uid: p.id,
    email: p.email,
    name: p.name,
    role: p.role,
    phone: p.phone ?? undefined,
    createdAt: new Date(p.created_at),
  };
}

export async function fetchProfile(userId: string): Promise<SupabaseProfile | null> {
  const supabase = getBrowserClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as SupabaseProfile;
}

export async function fetchVendor(userId: string): Promise<SupabaseVendor | null> {
  const supabase = getBrowserClient();
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as SupabaseVendor;
}
