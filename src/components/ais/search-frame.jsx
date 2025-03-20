import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/common';

const SearchFrame = ({ children, handleClickSearchBtn }) => {
  return (
    <FrameWrapper>
      {/* <FrameTitle>검색</FrameTitle> */}
      <FrameContent>{children}</FrameContent>
      <FrameButtonWrapper>
        <Button
          onClick={handleClickSearchBtn}
          className="w-60 bg-blue-600 text-white text-lg"
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
      className={cn(
        'flex flex-col w-full h-full border-2 border-gray-300',
        className
      )}
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
    <div className={cn('grid grid-cols-2 p-6 gap-6', className)} {...props}>
      {children}
    </div>
  );
};
FrameContent.displayName = 'FrameContent';

const FrameButtonWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex justify-center pb-6', className)} {...props}>
      {children}
    </div>
  );
};
FrameButtonWrapper.displayName = 'FrameButtonWrapper';
