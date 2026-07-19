'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  vendorStep1Schema,
  vendorStep2Schema,
  type VendorStep1Data,
  type VendorStep2Data,
} from '@/lib/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Eye, EyeOff, Building2, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const BUSINESS_TYPES = [
  { value: 'tour-operator', label: 'Tour Operator' },
  { value: 'activity-provider', label: 'Activity Provider' },
  { value: 'both', label: 'Both' },
] as const;

export function VendorRegisterForm() {
  const { registerVendorStep1, registerVendorStep2, loading, error, clearError, saveRedirectPath } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const step1 = useForm<VendorStep1Data>({ resolver: zodResolver(vendorStep1Schema) });
  const step2 = useForm<VendorStep2Data>({ resolver: zodResolver(vendorStep2Schema) });

  const onStep1 = step1.handleSubmit(async (data) => {
    clearError();
    saveRedirectPath();
    await registerVendorStep1({
      name: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
    setStep(2);
  });

  const onStep2 = step2.handleSubmit(async (data) => {
    clearError();
    await registerVendorStep2({
      businessName: data.businessName,
      businessType: data.businessType,
      registrationNumber: data.registrationNumber || undefined,
      gstNumber: data.gstNumber || undefined,
      businessAddress: data.businessAddress || undefined,
      description: data.description || undefined,
    });
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand + steps */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
          <Building2 className="h-6 w-6 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Join as Vendor</h1>
        <p className="text-gray-600 mt-2">List your weekend trips in two quick steps</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s ? <Check size={16} /> : s}
            </div>
            {s === 1 && <span className="text-sm text-gray-500">Your details</span>}
            {s === 2 && <span className="text-sm text-gray-500">Business</span>}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {step === 1 ? (
        <form onSubmit={onStep1} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Your Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...step1.register('fullName')} className={step1.formState.errors.fullName ? 'border-red-500' : ''} />
            {step1.formState.errors.fullName && <p className="text-sm text-red-600">{step1.formState.errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...step1.register('email')} className={step1.formState.errors.email ? 'border-red-500' : ''} />
            {step1.formState.errors.email && <p className="text-sm text-red-600">{step1.formState.errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+91 9876543210" {...step1.register('phone')} className={step1.formState.errors.phone ? 'border-red-500' : ''} />
            {step1.formState.errors.phone && <p className="text-sm text-red-600">{step1.formState.errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...step1.register('password')} className={step1.formState.errors.password ? 'border-red-500' : ''} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {step1.formState.errors.password && <p className="text-sm text-red-600">{step1.formState.errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="••••••••" {...step1.register('confirmPassword')} className={step1.formState.errors.confirmPassword ? 'border-red-500' : ''} />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {step1.formState.errors.confirmPassword && <p className="text-sm text-red-600">{step1.formState.errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={loading}>
            {loading ? 'Creating Account…' : <>Continue <ArrowRight size={16} className="ml-2" /></>}
          </Button>
        </form>
      ) : (
        <form onSubmit={onStep2} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" placeholder="Adventure Tours India" {...step2.register('businessName')} className={step2.formState.errors.businessName ? 'border-red-500' : ''} />
            {step2.formState.errors.businessName && <p className="text-sm text-red-600">{step2.formState.errors.businessName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Business Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {BUSINESS_TYPES.map((bt) => (
                <label
                  key={bt.value}
                  className="cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition data-[active=true]:border-primary-600 data-[active=true]:bg-primary-50 data-[active=true]:text-primary-700"
                  data-active={step2.watch('businessType') === bt.value}
                >
                  <input type="radio" value={bt.value} {...step2.register('businessType')} className="sr-only" />
                  {bt.label}
                </label>
              ))}
            </div>
            {step2.formState.errors.businessType && <p className="text-sm text-red-600">{step2.formState.errors.businessType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input id="registrationNumber" placeholder="e.g. UDYAM-IN-…" {...step2.register('registrationNumber')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstNumber">GST Number <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input id="gstNumber" placeholder="e.g. 29ABCDE1234F1Z5" {...step2.register('gstNumber')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input id="businessAddress" placeholder="Street, City, State" {...step2.register('businessAddress')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input id="description" placeholder="What makes your trips special?" {...step2.register('description')} />
          </div>

          <p className="text-xs text-gray-400">
            Logo &amp; banner can be added later from your vendor dashboard.
          </p>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700" disabled={loading}>
              {loading ? 'Saving…' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
        <p className="text-gray-600 mt-2 text-sm">
          Want to book trips?{' '}
          <Link href="/login?tab=register" className="text-primary-600 hover:text-primary-700 font-medium">
            Join as Customer
          </Link>
        </p>
      </div>
    </div>
  );
}
