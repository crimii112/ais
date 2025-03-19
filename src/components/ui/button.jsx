import { cn } from '@/lib/utils';

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        'w-full p-1.5 border-0 rounded-sm bg-gray-200 whitespace-nowrap text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
Button.displayName = 'Button';

export { Button };
