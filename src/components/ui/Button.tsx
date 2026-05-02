import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          {
            'bg-green-500 text-white hover:bg-green-600': variant === 'primary',
            'bg-green-100 text-green-900 hover:bg-green-200': variant === 'secondary',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
            'hover:bg-gray-100 text-gray-900': variant === 'ghost',
            'border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-900': variant === 'outline',
            'h-9 px-4 text-sm': size === 'sm',
            'h-12 px-6 text-base': size === 'md',
            'h-16 px-8 text-lg rounded-3xl': size === 'lg',
            'h-12 w-12': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
