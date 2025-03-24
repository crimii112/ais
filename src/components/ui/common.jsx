import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const FlexRowWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={`${cn(
        'flex flex-row items-center justify-center',
        className
      )}`}
      {...props}
    >
      {children}
    </div>
  );
};
FlexRowWrapper.displayName = 'FlexRowWrapper';

const FlexColWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={`${cn(
        'flex flex-col items-center justify-center',
        className
      )}`}
      {...props}
    >
      {children}
    </div>
  );
};
FlexColWrapper.displayName = 'FlexColWrapper';

const GridWrapper = ({ className, children, ...props }) => {
  return (
    <div className={`${cn('grid grid-cols-2', className)}`} {...props}>
      {children}
    </div>
  );
};
GridWrapper.displayName = 'GridWrapper';

const Button = forwardRef(({ className, children, ...props }, ref) => (
  <button
    className={cn(
      'w-full p-1.5 border-0 rounded-sm bg-gray-200 cursor-pointer whitespace-nowrap text-base',
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
      'p-1 border border-gray-300 rounded-sm bg-white text-base',
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
      'w-full p-1 box-border border border-gray-300 rounded-sm bg-white text-base',
      className
    )}`}
    ref={ref}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'SelectComponent';

const Option = ({ className, children, ...props }) => {
  return (
    <option
      className={`${cn(
        'bg-white hover:bg-blue-50 transition duration-100',
        className
      )}`}
      {...props}
    >
      {children}
    </option>
  );
};
Option.displayName = 'OptionComponent';

export {
  FlexRowWrapper,
  FlexColWrapper,
  GridWrapper,
  Button,
  Input,
  Select,
  Option,
};
