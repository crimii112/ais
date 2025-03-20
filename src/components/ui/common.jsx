import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(({ className, children, ...props }, ref) => (
  <button
    className={cn(
      'w-full p-1.5 border-0 rounded-sm bg-gray-200 whitespace-nowrap text-sm',
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = 'ButtonComponent';

const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    className={`${cn(
      'p-1 border border-gray-300 rounded-sm bg-white text-sm',
      className
    )}`}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'InputComponent';

const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select
    className={`${cn(
      'w-full p-1 box-border border border-gray-300 rounded-sm bg-white text-sm',
      className
    )}`}
    ref={ref}
    {...props}
  >
    {children}
  </select>
));

export { Button, Input, Select };
