import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-3xl bg-white border border-gray-100 p-6 shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
