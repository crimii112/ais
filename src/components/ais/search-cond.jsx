import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

import { SearchCondFrame } from './search-cond-frame';
import { Input, Select } from '@/components/ui/common';

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
      <GridContainer className="grid-cols-2 gap-1.5">
        {condList.map(cond =>
          cond.type === 'selectBox' ? (
            <GridContainer
              key={cond.id}
              className="grid-cols-[1fr_1.5fr] gap-1"
            >
              <div className="flex items-center justify-center bg-gray-200 text-sm">
                {cond.title}
              </div>
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
            </GridContainer>
          ) : (
            cond.type === 'textInput' && (
              <GridContainer
                key={cond.id}
                className="grid-cols-[1fr_1.5fr] gap-1"
              >
                <div className="flex items-center justify-center bg-gray-200 text-sm">
                  {cond.title}
                </div>
                <Input
                  type="text"
                  id={cond.id}
                  placeholder={cond.placeholder}
                  onChange={handleChangeCond}
                  className="w-full p-1.5"
                />
              </GridContainer>
            )
          )
        )}
      </GridContainer>
    </SearchCondFrame>
  );
};

export { SearchCond };

const GridContainer = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('grid items-stretch justify-stretch', className)}
      {...props}
    >
      {children}
    </div>
  );
};
GridContainer.displayName = 'GridContainer';
