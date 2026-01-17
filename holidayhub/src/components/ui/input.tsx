import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition',
        error ? 'border-red-500' : 'border-gray-300',
        className
      )}
      {...props}
    />
  );
}