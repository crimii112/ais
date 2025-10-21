import { SearchCondFrame } from './search-cond-frame';
import {
  GridWrapper,
  FlexRowWrapper,
  FlexColWrapper,
} from '@/components/ui/common';
import { Select } from '@/components/ui/select-box';

const SearchIabnrmCond = () => {
  return (
    <SearchCondFrame title="검색조건">
      <GridWrapper className="grid-cols-[1fr_3fr] gap-1">
        <FlexRowWrapper className="bg-gray-200 font-semibold">
          선택옵션
        </FlexRowWrapper>
        <FlexColWrapper>
          <GridWrapper className="grid-cols-2 gap-1">
            <Select></Select>
            <Select></Select>
          </GridWrapper>
        </FlexColWrapper>
      </GridWrapper>
    </SearchCondFrame>
  );
};

export { SearchIabnrmCond };

const condFlag = [{ value: 'flag', text: '' }];
