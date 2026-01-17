'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/use-auth';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth.schema';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const { login, loading, error, clearError, saveRedirectPath } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    saveRedirectPath(); // Save current path before redirect
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
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
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <Link 
            href="/register/customer" 
            className="text-primary-600 hover:text-primary-700 font-medium"
            onClick={() => saveRedirectPath()}
          >
            Sign up as Customer
          </Link>
        </p>
        <p className="text-gray-600 mt-2">
          Or{' '}
          <Link 
            href="/register/vendor" 
            className="text-primary-600 hover:text-primary-700 font-medium"
            onClick={() => saveRedirectPath()}
          >
            Join as Vendor
          </Link>
        </p>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link 
            href="/forgot-password" 
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => saveRedirectPath()}
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}