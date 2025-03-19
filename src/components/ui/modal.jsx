import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ModalFrame = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'fixed min-h-screen max-h-screen inset-0 z-50 flex items-center justify-center bg-black/50',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative z-50 min-h-[650px] max-w-[1000px]  overflow-x-hidden rounded-sm bg-white shadow-lg sm:w-full',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
ModalFrame.displayName = 'ModalFrame';

const ModalHeader = ({ title, handleCloseModal, className, ...props }) => {
  return (
    <div
      className={cn(
        'p-3 flex flex-row justify-between items-center',
        className
      )}
      {...props}
    >
      <div className="text-xl font-bold">{title}</div>
      <X onClick={handleCloseModal} />
    </div>
  );
};
ModalHeader.displayName = 'ModalHeader';

const ModalContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('w-full p-3.5', className)} {...props}>
      {children}
    </div>
  );
};
ModalContent.displayName = 'ModalContent';

export { ModalFrame, ModalHeader, ModalContent };
