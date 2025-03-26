import { useEffect, useState } from 'react';

import { SearchCondFrame } from './search-cond-frame';
import {
  FlexRowWrapper,
  GridWrapper,
  Input,
  Select,
} from '@/components/ui/common';

const SearchCond = ({ condList, initialSearchCond, setSearchCond }) => {
  const [condJson, setCondJson] = useState(initialSearchCond);

  useEffect(() => {
    setSearchCond(condJson);
  }, [condJson]);

  const handleChangeCond = e => {
    const condId = e.target.id;
    const condValue = e.target.value;
    setCondJson(prev => ({ ...prev, [condId]: condValue }));
  };

  return (
    <SearchCondFrame title="검색 조건">
      <GridWrapper className="gap-1.5 items-stretch justify-stretch">
        {condList.map(cond =>
          cond.type === 'selectBox' ? (
            <GridWrapper key={cond.id} className="grid-cols-[1fr_1.5fr] gap-1">
              <FlexRowWrapper className="bg-gray-200 font-semibold">
                {cond.title}
              </FlexRowWrapper>
              <Select
                id={cond.id}
                onChange={handleChangeCond}
                className="p-1.5"
              >
                {cond.content.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </Select>
            </GridWrapper>
          ) : (
            cond.type === 'textInput' && (
              <GridWrapper
                key={cond.id}
                className="grid-cols-[1fr_1.5fr] gap-1"
              >
                <div className="flex items-center justify-center bg-gray-200 font-semibold">
                  {cond.title}
                </div>
                <Input
                  type="text"
                  id={cond.id}
                  placeholder={cond.placeholder}
                  disabled={cond.disabled}
                  onChange={handleChangeCond}
                  className={`w-full p-1.5 ${cond.disabled && 'bg-gray-200'}`}
                />
              </GridWrapper>
            )
          )
        )}
      </GridWrapper>
    </SearchCondFrame>
  );
};

export { SearchCond };
