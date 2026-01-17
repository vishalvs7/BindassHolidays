'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/use-auth';
import { vendorRegisterSchema, type VendorRegisterFormData } from '@/lib/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Eye, EyeOff, Building2 } from 'lucide-react';

export function VendorRegisterForm() {
  const { registerVendor, loading, error, clearError, saveRedirectPath } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorRegisterFormData>({
    resolver: zodResolver(vendorRegisterSchema),
  });

  const onSubmit = async (data: VendorRegisterFormData) => {
    clearError();
    saveRedirectPath();
    try {
      await registerVendor({
        fullName: data.fullName,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
          <Building2 className="h-6 w-6 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Join as Vendor</h1>
        <p className="text-gray-600 mt-2">List your tours and grow your business</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Your Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...register('fullName')}
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            placeholder="Adventure Tours India"
            {...register('businessName')}
            className={errors.businessName ? 'border-red-500' : ''}
          />
          {errors.businessName && (
            <p className="text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Business Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@adventuretours.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Business Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 9876543210"
            {...register('phone')}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {showPassword ? (
                <>
                  <EyeOff size={16} />
                  Hide
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Show
                </>
              )}
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {showConfirmPassword ? (
                <>
                  <EyeOff size={16} />
                  Hide
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Show
                </>
              )}
            </button>
          </div>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700"
          disabled={loading}
        >
          {loading ? 'Creating Vendor Account...' : 'Create Vendor Account'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-primary-600 hover:text-primary-700 font-medium"
            onClick={() => saveRedirectPath()}
          >
            Sign in
          </Link>
        </p>
        <p className="text-gray-600 mt-2 text-sm">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Want to book tours?{' '}
            <Link href="/register/customer" className="text-primary-600 hover:text-primary-700 font-medium">
              Join as Customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}