import { useEffect, useRef, useState } from 'react';

import {
  FlexRowWrapper,
  FlexColWrapper,
  Button,
  Select,
} from '@/components/ui/common';
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
        <FlexRowWrapper className="items-stretch gap-1 w-full h-full">
          <FlexRowWrapper className="items-stretch grow">
            <Select multiple ref={multipleSelectRef}>
              {multipleStationList &&
                multipleStationList.map(station => (
                  <option key={station.siteCd}>{station.siteData}</option>
                ))}
            </Select>
          </FlexRowWrapper>
          <FlexColWrapper className="justify-baseline w-23 gap-0.5">
            <Button
              className="border-2 border-blue-900 bg-white"
              onClick={handleClickSelectStationBtn}
            >
              측정소 선택
            </Button>
            <Button onClick={handleClickDeleteSelected}>선택 삭제</Button>
            <Button onClick={handleClickDeleteAll}>전체 삭제</Button>
          </FlexColWrapper>
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
