import { cn } from '@/lib/utils';

const SearchCondFrame = ({ children, title }) => (
  <FrameWrapper>
    <FrameTitle>{title}</FrameTitle>
    <FrameContent>{children}</FrameContent>
  </FrameWrapper>
);

export { SearchCondFrame };

const FrameWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-col shadow', className)} {...props}>
      {children}
    </div>
  );
};
FrameWrapper.displayName = 'SearchCondFrameWrapper';

const FrameTitle = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'p-2 bg-gray-100 text-gray-600 text-lg font-bold',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
FrameTitle.displayName = 'SearchCondFrameTitle';

const FrameContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('grow flex flex-col gap-1 p-1 bg-white', className)}
      {...props}
    >
      {children}
    </div>
  );
};
FrameContent.displayName = 'SearchCondFrameContent';
