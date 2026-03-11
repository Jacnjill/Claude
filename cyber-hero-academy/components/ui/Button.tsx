'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // base
          'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed',
          // variants
          variant === 'primary' &&
            'bg-brand-purple hover:bg-brand-violet text-white shadow-lg shadow-brand-purple/30 hover:shadow-brand-violet/40 focus:ring-brand-purple active:scale-95',
          variant === 'secondary' &&
            'bg-transparent border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 focus:ring-brand-cyan active:scale-95',
          variant === 'ghost' &&
            'bg-transparent text-gray-300 hover:text-white hover:bg-white/10 focus:ring-white/20',
          variant === 'danger' &&
            'bg-brand-red hover:bg-red-600 text-white focus:ring-brand-red active:scale-95',
          // sizes
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-5 py-2.5 text-base',
          size === 'lg' && 'px-8 py-3.5 text-lg',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading…
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
