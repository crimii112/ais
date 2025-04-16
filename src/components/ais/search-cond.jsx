import { useEffect, useState } from 'react';

import { SearchCondFrame } from './search-cond-frame';
import {
  FlexRowWrapper,
  GridWrapper,
  Input,
  Select,
} from '@/components/ui/common';


/**
 * 검색 조건 선택 컴포넌트
 * @param {Object} condList - 검색 조건 리스트
 * @param {Object} initialSearchCond - 초기 검색 조건
 * @param {function} setSearchCond - 검색 조건 설정 함수
 * @example condList = [{type: 'selectBox', title: '데이터구분', id: 'sect', content: [{value: 'time', text: '시간별'}, {value: 'day', text: '일별'}, ...]}, ...]
 * @example initialSearchCond = { sect: 'time', region: 'sido', stats: 'avg', sort: 'groupdate', dust: 'include', usertime: '' }
 * @returns {React.ReactNode} 검색 조건 선택 컴포넌트
 */


const SearchCond = ({ condList, initialSearchCond, setSearchCond }) => {
  const [condJson, setCondJson] = useState(initialSearchCond);

  useEffect(() => {
    setSearchCond(condJson);
  }, [condJson]);

  // 검색 조건 변경 이벤트
  const handleChangeCond = e => {
    const condId = e.target.id;
    const condValue = e.target.value;
    setCondJson(prev => ({ ...prev, [condId]: condValue }));
  };

  return (
    <SearchCondFrame title="검색 조건">
      <GridWrapper className="gap-1.5 items-stretch justify-stretch">
        {condList.map(cond =>
          cond.type === 'selectBox' ? (     // 선택 박스 타입
            <GridWrapper key={cond.id} className="grid-cols-[1fr_1.5fr] gap-1">
              <FlexRowWrapper className="bg-gray-200 font-semibold">
                {cond.title}
              </FlexRowWrapper>
              <Select
                id={cond.id}
                onChange={handleChangeCond}
                className={`p-1.5 ${cond.disabled && 'bg-gray-200'}`}
                disabled={cond.disabled}
              >
                {cond.content.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </Select>
            </GridWrapper>
          ) : (
            cond.type === 'textInput' && (     // 텍스트 입력 타입
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
