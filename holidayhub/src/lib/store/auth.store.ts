import { create } from 'zustand';
import { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';

export type UserRole = 'customer' | 'vendor';

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  businessName?: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  registerCustomer: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  registerVendor: (data: { fullName: string; businessName: string; email: string; password: string; phone: string }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        set({ user, userData });
        
        // Store role
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('userId', user.uid);
        }
        
        console.log('Login successful:', userData);
      } else {
        set({ error: 'User data not found. Please register again.' });
      }
    } catch (error: any) {
      const message = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password' 
        : error.message || 'Login failed';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  registerCustomer: async (data: { name: string; email: string; password: string; phone: string }) => {
    set({ loading: true, error: null });
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      console.log('Starting customer registration...');
      
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('✅ Auth user created:', user.uid);
      
      // Update profile
      await updateProfile(user, { displayName: data.name });
      console.log('✅ Profile updated');
      
      // Create Firestore document
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        name: data.name,
        role: 'customer',
        phone: data.phone,
        createdAt: new Date(),
      };
      
      console.log('Creating Firestore document...');
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
      });
      console.log('✅ Firestore document created');
      
      set({ user, userData });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', 'customer');
        localStorage.setItem('userId', user.uid);
      }
      
      console.log('🎉 Registration completed successfully');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let message = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email already registered';
      } else if (error.code === 'permission-denied') {
        message = 'Database error. Please try again.';
      } else if (error.message) {
        message = error.message;
      }
      
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  registerVendor: async (data: { fullName: string; businessName: string; email: string; password: string; phone: string }) => {
    set({ loading: true, error: null });
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      console.log('Starting vendor registration...');
      
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('✅ Auth user created:', user.uid);
      
      // Update profile
      await updateProfile(user, { displayName: data.fullName });
      console.log('✅ Profile updated');
      
      // Create Firestore document
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        name: data.fullName,
        role: 'vendor',
        phone: data.phone,
        businessName: data.businessName,
        createdAt: new Date(),
      };
      
      console.log('Creating Firestore document...');
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
      });
      console.log('✅ Firestore document created');
      
      set({ user, userData });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', 'vendor');
        localStorage.setItem('userId', user.uid);
      }
      
      console.log('🎉 Vendor registration completed successfully');
      
    } catch (error: any) {
      console.error('Vendor registration error:', error);
      
      let message = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email already registered';
      } else if (error.code === 'permission-denied') {
        message = 'Database error. Please try again.';
      } else if (error.message) {
        message = error.message;
      }
      
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      set({ user: null, userData: null });
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('redirectPath');
      }
    } catch (error: any) {
      set({ error: error.message || 'Logout failed' });
    }
  },

  forgotPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      set({ error: error.message || 'Failed to send reset email' });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));