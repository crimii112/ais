import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const SearchFrame = ({ children, handleClickSearchBtn }) => {
  return (
    <FrameWrapper>
      {/* <FrameTitle>검색</FrameTitle> */}
      <FrameContent>{children}</FrameContent>
      <FrameButtonWrapper className="flex justify-center pb-2">
        <Button
          onClick={handleClickSearchBtn}
          className="w-20 bg-blue-600 text-white"
        >
          검색
        </Button>
      </FrameButtonWrapper>
    </FrameWrapper>
  );
};

export { SearchFrame };

const FrameWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('flex flex-col w-full h-full bg-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};
FrameWrapper.displayName = 'FrameWrapper';

const FrameTitle = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-start p-2 pb-0 text-2xl font-bold',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
FrameTitle.displayName = 'FrameTitle';

const FrameContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('grid grid-cols-2 p-2 gap-2', className)} {...props}>
      {children}
    </div>
  );
};
FrameContent.displayName = 'FrameContent';

const FrameButtonWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex justify-center pb-2', className)} {...props}>
      {children}
    </div>
  );
};
FrameButtonWrapper.displayName = 'FrameButtonWrapper';
