import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    userData,
    loading,
    error,
    login,
    registerCustomer,
    registerVendor,
    logout,
    clearError,
  } = useAuthStore();

  // Save intended destination
  const saveRedirectPath = useCallback(() => {
    if (typeof window !== 'undefined' && pathname) {
      if (!pathname.includes('/login') && 
          !pathname.includes('/register') &&
          !pathname.includes('/forgot-password')) {
        localStorage.setItem('redirectPath', pathname);
        console.log('Saved redirect path:', pathname);
      }
    }
  }, [pathname]);

  // Redirect based on role
  useEffect(() => {
    if (userData && (pathname === '/login' || pathname?.includes('/register'))) {
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      const role = userData.role;
      
      console.log('Attempting redirect. Role:', role, 'Path:', redirectPath);
      
      // Small delay to ensure React state updates
      const timer = setTimeout(() => {
        if (role === 'customer') {
          router.push('/customer/dashboard');
        } else if (role === 'vendor') {
          router.push('/vendor/dashboard');
        }
        
        // Clear redirect path
        localStorage.removeItem('redirectPath');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [userData, router, pathname]);

  return {
    user,
    userData,
    loading,
    error,
    login,
    registerCustomer,
    registerVendor,
    logout,
    clearError,
    saveRedirectPath,
    isAuthenticated: !!user,
    role: userData?.role,
  };
};