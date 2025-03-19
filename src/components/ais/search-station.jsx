import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { SearchCondFrame } from './search-cond-frame';
import { SearchStationModal } from './search-station-modal';

const SearchStation = ({ title, setStationList }) => {
  const [multipleStationList, setMultipleStationList] = useState([]);

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [modalTabType, setModalTabType] = useState(0);

  const multipleSelectRef = useRef();

  // title에 따라 모달 탭 구성 설정
  useEffect(() => {
    if (['대기측정소', '기상대'].includes(title)) {
      setModalTabType(1);
    } else if (
      ['TMS', '유해대기', '중금속', '산성강하물', '입경중량'].includes(title)
    ) {
      setModalTabType(2);
    }
  }, [title]);

  useEffect(() => {
    const arr = [];
    multipleStationList.forEach(station => arr.push(station.siteCd.toString()));
    setStationList(arr);
  }, [multipleStationList]);

  // 모달 open
  const handleClickSelectStationBtn = () => {
    setIsModalOpened(true);
  };

  // 선택 삭제 버튼 클릭 이벤트
  const handleClickDeleteSelected = () => {
    const selectedItems = Array.from(multipleSelectRef.current.selectedOptions);

    if (selectedItems != null) {
      let newArr = multipleStationList;
      selectedItems.forEach(option => {
        newArr = newArr.filter(listItem => listItem.siteData != option.value);
      });
      setMultipleStationList(newArr);
    }
  };

  // 전체 삭제 버튼 클릭 이벤트
  const handleClickDeleteAll = () => setMultipleStationList([]);

  return (
    <>
      <SearchCondFrame title={title}>
        <FlexRowWrapper className="gap-1 w-full h-full">
          <FlexRowWrapper className="grow">
            <SelectBox multiple ref={multipleSelectRef}>
              {multipleStationList &&
                multipleStationList.map(station => (
                  <option key={station.siteCd}>{station.sideData}</option>
                ))}
            </SelectBox>
          </FlexRowWrapper>
          <ButtonDiv className="flex flex-col gap-0.5">
            <Button
              className="bg-blue-600 text-white"
              onClick={handleClickSelectStationBtn}
            >
              측정소 선택
            </Button>
            <Button className="text-sm" onClick={handleClickDeleteSelected}>
              선택 삭제
            </Button>
            <Button className="text-sm" onClick={handleClickDeleteAll}>
              전체 삭제
            </Button>
          </ButtonDiv>
        </FlexRowWrapper>
      </SearchCondFrame>
      {isModalOpened && (
        <SearchStationModal
          tabType={modalTabType}
          setIsModalOpened={setIsModalOpened}
          setMultipleStationList={setMultipleStationList}
        />
      )}
    </>
  );
};

export { SearchStation };

const FlexRowWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-row items-stretch', className)} {...props}>
      {children}
    </div>
  );
};
FlexRowWrapper.displayName = 'FlexRowWrapper';

const SelectBox = ({ className, children, ...props }) => {
  return (
    <select
      className={cn(
        'w-full p-1 box-border border border-gray-300 rounded-sm text-base',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};
SelectBox.displayName = 'SelectBox';

const ButtonDiv = ({ className, children, ...props }) => {
  return (
    <div className={cn('w-20', className)} {...props}>
      {children}
    </div>
  );
};
ButtonDiv.displayName = 'ButtonDiv';
