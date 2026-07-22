'use client';

import { LoginForm } from '@/components/auth/login-form';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginInner() {
  const params = useSearchParams();
  const tab = params.get('tab') === 'register' ? 'register' : 'login';
  return <LoginForm initialTab={tab} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <LoginInner />
    </Suspense>
  );
}
