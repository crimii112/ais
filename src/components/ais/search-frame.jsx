import {
  FlexRowWrapper,
  FlexColWrapper,
  GridWrapper,
  Button,
} from '@/components/ui/common';

const SearchFrame = ({ children, handleClickSearchBtn }) => {
  return (
    <FlexColWrapper className="w-full h-full items-stretch border-2 border-gray-300">
      <GridWrapper className="grid-cols-2 gap-6 p-6">{children}</GridWrapper>
      <FlexRowWrapper className="pb-6">
        <Button
          onClick={handleClickSearchBtn}
          className="w-60 bg-blue-600 text-white text-lg"
        >
          검색
        </Button>
      </FlexRowWrapper>
    </FlexColWrapper>
  );
};

export { SearchFrame };
