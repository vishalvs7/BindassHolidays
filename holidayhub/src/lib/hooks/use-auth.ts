import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, dashboardFor } from '@/lib/store/auth.store';

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    userData,
    vendorData,
    loading,
    initialized,
    error,
    login,
    registerCustomer,
    registerVendorStep1,
    registerVendorStep2,
    loginWithGoogle,
    logout,
    forgotPassword,
    clearError,
    init,
  } = useAuthStore();

  // Initialize session (onAuthStateChange) once on mount
  useEffect(() => {
    if (!initialized) {
      init();
    }
  }, [initialized, init]);

  // Save intended destination for post-login redirect
  const saveRedirectPath = useCallback(() => {
    if (typeof window !== 'undefined' && pathname) {
      if (
        !pathname.includes('/login') &&
        !pathname.includes('/register') &&
        !pathname.includes('/forgot-password')
      ) {
        localStorage.setItem('redirectPath', pathname);
      }
    }
  }, [pathname]);

  // Redirect to role dashboard after auth on login/register pages
  useEffect(() => {
    if (initialized && userData && (pathname === '/login' || pathname?.includes('/register'))) {
      const redirectPath = localStorage.getItem('redirectPath');
      localStorage.removeItem('redirectPath');
      const destination = redirectPath && !redirectPath.includes('/login') && !redirectPath.includes('/register')
        ? redirectPath
        : dashboardFor(userData.role);
      router.replace(destination);
    }
  }, [initialized, userData, pathname, router]);

  return {
    user,
    userData,
    vendorData,
    loading,
    initialized,
    error,
    login,
    registerCustomer,
    registerVendorStep1,
    registerVendorStep2,
    loginWithGoogle,
    logout,
    forgotPassword,
    clearError,
    init,
    saveRedirectPath,
    isAuthenticated: !!user,
    role: userData?.role,
  };
};
