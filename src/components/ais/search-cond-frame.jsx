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
    <div
      className={cn(
        'flex flex-col shadow-lg border-1 border-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
FrameWrapper.displayName = 'SearchCondFrameWrapper';

const FrameTitle = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center p-1 bg-gray-200 text-gray-600 text-xl font-bold',
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
      className={cn('grow flex flex-col gap-1 p-2 bg-white', className)}
      {...props}
    >
      {children}
    </div>
  );
};
FrameContent.displayName = 'SearchCondFrameContent';
