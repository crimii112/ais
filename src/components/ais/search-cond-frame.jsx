import { cn } from '@/lib/utils';
import { FlexRowWrapper, FlexColWrapper } from '@/components/ui/common';

const SearchCondFrame = ({ children, title }) => (
  <FlexColWrapper className="shadow-lg border-1 border-gray-300 items-stretch">
    <FlexRowWrapper className="p-1 bg-gray-200 text-gray-600 text-xl font-bold">
      {title}
    </FlexRowWrapper>
    <FlexColWrapper className="grow items-stretch justify-baseline gap-1 p-2 bg-white">
      {children}
    </FlexColWrapper>
  </FlexColWrapper>
);

export { SearchCondFrame };
