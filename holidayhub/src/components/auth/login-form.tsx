'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/use-auth';
import { loginSchema, customerRegisterSchema, type LoginFormData, type CustomerRegisterFormData } from '@/lib/schemas/auth.schema';
import Link from 'next/link';
import { Eye, EyeOff, Chrome } from 'lucide-react';

type Mode = 'login' | 'register';

export function LoginForm({ initialTab = 'login' }: { initialTab?: Mode }) {
  const { login, registerCustomer, loginWithGoogle, loading, error, clearError, saveRedirectPath } = useAuth();
  const [mode, setMode] = useState<Mode>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [googleEnabled] = useState(false);

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<CustomerRegisterFormData>({ resolver: zodResolver(customerRegisterSchema) });

  const switchMode = (next: Mode) => {
    clearError();
    setMode(next);
  };

  const onLogin = loginForm.handleSubmit(async (data) => {
    clearError();
    saveRedirectPath();
    await login(data.email, data.password);
  });

  const onRegister = registerForm.handleSubmit(async (data) => {
    clearError();
    saveRedirectPath();
    await registerCustomer({ name: data.name, email: data.email, password: data.password, phone: data.phone });
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-bold">
            BH
          </span>
          <span className="text-2xl font-bold text-gray-900">Bindass Holiday</span>
        </Link>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
            mode === 'login' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
            mode === 'register' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Create Account
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {/* Google (placeholder) */}
      <button
        type="button"
        disabled={!googleEnabled}
        onClick={() => googleEnabled && loginWithGoogle()}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed mb-4"
      >
        <Chrome size={18} className="text-gray-700" />
        {googleEnabled ? 'Continue with Google' : 'Continue with Google (coming soon)'}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {mode === 'login' ? (
        <form onSubmit={onLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...loginForm.register('email')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                loginForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...loginForm.register('password')}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                  loginForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={onRegister} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="reg-name"
              placeholder="John Doe"
              {...registerForm.register('name')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                registerForm.formState.errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {registerForm.formState.errors.name && (
              <p className="text-sm text-red-600">{registerForm.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              {...registerForm.register('email')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                registerForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {registerForm.formState.errors.email && (
              <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="reg-phone"
              type="tel"
              placeholder="+91 9876543210"
              {...registerForm.register('phone')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                registerForm.formState.errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {registerForm.formState.errors.phone && (
              <p className="text-sm text-red-600">{registerForm.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...registerForm.register('password')}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                  registerForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {registerForm.formState.errors.password && (
              <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-70"
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Want to list your trips?{' '}
            <Link href="/register/vendor" className="text-primary-600 font-medium hover:text-primary-700">
              Join as a Vendor
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
