import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';

export const useRoleAuth = (requiredRole: 'customer' | 'vendor' | 'admin') => {
  const router = useRouter();
  const { userData, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (!loading && initialized) {
      if (!userData) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (userData.role !== requiredRole) {
        // Wrong role, redirect to appropriate dashboard
        if (userData.role === 'customer') {
          router.push('/customer/dashboard');
        } else if (userData.role === 'vendor') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  }, [userData, loading, initialized, requiredRole, router]);

  return {
    isAuthorized: userData?.role === requiredRole,
    loading: loading || !initialized,
    role: userData?.role,
  };
};