import { useRef, useState } from 'react';
import axios from 'axios';
import { SquareArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  ModalFrame,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '@/components/ui/modal';
import { Button, Input, Select } from '@/components/ui/common';

const SearchStationModal = ({
  tabType,
  setIsModalOpened,
  setMultipleStationList,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedStationList, setSelectedStationList] = useState([]); //선택한 측정소 - list
  const [selectedOptions, setSelectedOptions] = useState([]); //선택한 측정소 - select onChange에 사용

  // 우측 상단 - tms 설정, 추이측정소
  const [tms, setTms] = useState({ airqltKndNm: '도시대기', progressYn: '0' });

  // SidoNm(방식에 따라 구분) - API 호출 시 필요
  const [checkboxSidoNm, setCheckboxSidoNm] = useState([]);
  const [selectboxSidoNm, setSelectboxSidoNm] = useState([]);
  const [radioSidoNm, setRadioSidoNm] = useState('전국');

  // 검색 방식
  const tbxSidoSearchRef = useRef(); //input
  const [searchStationList, setSearchStationList] = useState([]); //검색 결과 list(선택 전 list)
  const searchStationRef = useRef(); //multiple select dom

  // 시도 선택 checkbox list
  const [sidoCheckboxList, setSidoCheckboxList] = useState([
    { value: 'all', text: '전국', checked: false },
    { value: 'capital', text: '수도권', checked: false },
    { value: 'seoul', text: '서울', checked: false },
    { value: 'gyeonggi', text: '경기', checked: false },
    { value: 'incheon', text: '인천', checked: false },
    { value: 'daejeon', text: '대전', checked: false },
    { value: 'daegu', text: '대구', checked: false },
    { value: 'busan', text: '부산', checked: false },
    { value: 'ulsan', text: '울산', checked: false },
    { value: 'gwangju', text: '광주', checked: false },
    { value: 'sejong', text: '세종', checked: false },
    { value: 'gangwon', text: '강원', checked: false },
    { value: 'chungbuk', text: '충북', checked: false },
    { value: 'chungnam', text: '충남', checked: false },
    { value: 'jeonbuk', text: '전북', checked: false },
    { value: 'jeonnam', text: '전남', checked: false },
    { value: 'gyeongbuk', text: '경북', checked: false },
    { value: 'gyeongnam', text: '경남', checked: false },
    { value: 'jeju', text: '제주', checked: false },
  ]);

  // api(/sido.do) 호출 함수
  const getSearchStation = async () => {
    if (activeTabIndex === 0 && checkboxSidoNm.length === 0) {
      alert('시도를 선택해주십시오.');
      return;
    }
    if (activeTabIndex === 1 && tbxSidoSearchRef.current.value === '') {
      alert('검색어를 입력해주십시오.');
      tbxSidoSearchRef.current.focus();
      return;
    }

    /* activeTabIndex에 따라서 data 달라짐(sidoNm, tbxSidoSearch) */
    let sidoNm;
    let tbxSidoSearch = '';

    if (activeTabIndex === 0) {
      sidoNm = checkboxSidoNm;
    } else if (activeTabIndex === 1) {
      sidoNm = selectboxSidoNm;
      tbxSidoSearch = tbxSidoSearchRef.current.value;
    } else if (activeTabIndex === 2) {
      sidoNm = radioSidoNm;
    }

    const apiData = {
      airqltKndNm: tms.airqltKndNm,
      progressYn: tms.progressYn,
      searchtype: 'tabpage' + activeTabIndex,
      sidoNm: sidoNm,
      siteType: '',
      tbxSidoSearch: tbxSidoSearch,
    };
    const apiRes = await axios.post(
      `${import.meta.env.VITE_API_URL}/ais/srch/sido.do`,
      apiData
    );

    if ([0, 2].includes(activeTabIndex)) {
      setSelectedStationList(apiRes.data.sidoList);
    } else if (activeTabIndex === 1) {
      setSearchStationList(apiRes.data.sidoList);
    }
  };

  // 시도 선택 방식 - 체크박스 onChange
  const handleChangeCheckbox = e => {
    const id = e.target.id;
    const checked = e.target.checked;

    const arr = [...sidoCheckboxList];

    if (id === '전국') {
      arr.forEach(item => (item.checked = checked));
    } else if (id === '수도권') {
      arr.forEach(item => {
        if (['수도권', '서울', '인천', '경기'].includes(item.text)) {
          item.checked = checked;
        }
      });
    } else {
      if (sidoCheckboxList[0].checked && !checked) {
        arr.find(item => item.text === '전국').checked = false;
      } else if (
        sidoCheckboxList[1].checked &&
        !checked &&
        ['서울', '경기', '인천'].includes(id)
      ) {
        arr.find(item => item.text === '수도권').checked = false;
      }
      arr.find(item => item.text === id).checked = checked;
    }

    setSidoCheckboxList(arr); //checkbox item state 변경

    const sidoNmArr = [];
    arr.forEach(item => {
      if (item.checked && item.text !== '전국' && item.text !== '수도권') {
        sidoNmArr.push(item.text);
      }
    });
    setCheckboxSidoNm(sidoNmArr); //api 호출 데이터 state 변경
  };

  // 검색 방식 - 선택 버튼 클릭 이벤트
  const handleClickSearchBtn = () => {
    const selectedOptions = Array.from(
      searchStationRef.current.selectedOptions
    );

    if (selectedOptions === null) return;

    let selectedStationArr = selectedStationList;
    selectedOptions.forEach(option => {
      const stationJson = searchStationList.find(
        item => item.siteData === option.innerText
      );

      // 중복 데이터 방지
      if (!selectedStationArr.find(item => item.siteCd === stationJson.siteCd))
        selectedStationArr.push(stationJson);
    });

    setSelectedStationList([...selectedStationArr]);
  };

  // Content 1) 시도 선택 방식
  const ContentSelectSido = (
    <SearchStationWrapper>
      <SelectBoxWrapper title="시도">
        <SelectBoxTitle type="text">시도</SelectBoxTitle>
        <div className="grow grid grid-cols-3 p-8">
          {sidoCheckboxList.map(sido => (
            <label
              key={sido.value}
              className={`${
                sido.text === '서울' && 'col-start-1'
              } flex items-center ml-6`}
            >
              <Input
                className="mr-2"
                type="checkbox"
                id={sido.text}
                checked={sido.checked}
                onChange={handleChangeCheckbox}
              />
              {sido.text}
            </label>
          ))}
        </div>
      </SelectBoxWrapper>
      <ButtonWrapper>
        <SquareArrowRight
          width="40px"
          height="40px"
          onClick={getSearchStation}
          className="rounded-xl text-blue-900"
        />
      </ButtonWrapper>
    </SearchStationWrapper>
  );

  // Content 2) 검색 방식
  const ContentSearch = (
    <SearchStationWrapper>
      <SelectBoxWrapper>
        <SelectBoxTitle type="grid">
          <Select
            name="searchTypeSidoNm"
            onChange={e => setSelectboxSidoNm([e.target.value])}
          >
            {RegionOptionList.map(region => (
              <option key={region.text} value={region.text}>
                {region.text}
              </option>
            ))}
          </Select>
          <Input ref={tbxSidoSearchRef} className="rounded-none" />
          <Button
            className="bg-gray-600 text-white rounded-none"
            onClick={getSearchStation}
          >
            검색
          </Button>
        </SelectBoxTitle>
        <div className="grow">
          <Select
            multiple
            ref={searchStationRef}
            className="w-full h-full border-none"
          >
            {searchStationList &&
              searchStationList.map(station => (
                <option key={station.siteCd}>{station.siteData}</option>
              ))}
          </Select>
        </div>
      </SelectBoxWrapper>
      <ButtonWrapper>
        <SquareArrowRight
          width="40px"
          height="40px"
          onClick={handleClickSearchBtn}
          className="rounded-xl text-blue-900"
        />
      </ButtonWrapper>
    </SearchStationWrapper>
  );

  // Content 3) 기타 방식
  const ContentEtc = (
    <SearchStationWrapper>
      <SelectBoxWrapper>
        <SelectBoxTitle type="text">기타</SelectBoxTitle>
        <div className="grow grid grid-cols-1 items-center p-12">
          {EtcRadioBtnList.map(etc => (
            <label key={etc.text} className="flex items-center">
              <Input
                type="radio"
                name="etc"
                defaultChecked={etc.text === '전국' && 'checked'}
                id={etc.text}
                onClick={e => setRadioSidoNm(e.target.id)}
                className="mr-2"
              />
              {etc.text}
            </label>
          ))}
        </div>
      </SelectBoxWrapper>
      <ButtonWrapper>
        <SquareArrowRight
          width="40px"
          height="40px"
          onClick={getSearchStation}
          className="rounded-xl text-blue-900"
        />
      </ButtonWrapper>
    </SearchStationWrapper>
  );

  // tabType에 따른 탭 구성
  const tabList =
    tabType === 1
      ? [
          { title: '시도 선택 방식', content: ContentSelectSido },
          { title: '검색 방식', content: ContentSearch },
          { title: '기타 방식', content: ContentEtc },
        ]
      : tabType === 2
      ? [
          { title: '시도 선택 방식', content: ContentSelectSido },
          { title: '검색 방식', content: ContentSearch },
        ]
      : tabType === 3 && [
          { title: '가까운 측정소 검색 방식', content: <div></div> },
          { title: '검색 방식', content: ContentSearch },
        ];

  const handleCloseModal = () => {
    setIsModalOpened(false);
  };

  // 좌측 상단 - 탭 이동시 검색 데이터 초기화
  const initSearchData = () => {
    setSidoCheckboxList(prev => {
      prev.forEach(item => (item.checked = false));
      return prev;
    });
    setCheckboxSidoNm([]);

    document.getElementsByName(
      'searchTypeSidoNm'
    )[0].options[0].selected = true;
    tbxSidoSearchRef.current.value = '';
    setSearchStationList([]);
    setSelectboxSidoNm([]);

    document.getElementsByName('etc')[0].checked = true;
    setRadioSidoNm('전국');
  };
  // 좌측 상단 - 탭 버튼 클릭 이벤트
  const handleClickTabBtn = e => {
    initSearchData();
    setActiveTabIndex(Number(e.target.id));
    setSelectedStationList([]);
  };

  // 우측 상단 - TMS 변경 이벤트
  const handleChangeAirqltKndNm = e => {
    tms.airqltKndNm = e.target.value;
    setTms(tms);
  };
  // 우측 상단 - 추이 측정소 변경 이벤트
  const handleChangeProgressYn = e => {
    tms.progressYn = e.target.checked ? '1' : '0';
    setTms(tms);
  };

  // 선택한 측정소 - multiple select 변경 이벤트
  const handleChangeMultipleSelect = e => {
    setSelectedOptions(Array.from(e.target.selectedOptions));
  };
  // 선택한 측정소 - 선택 삭제 버튼 클릭 이벤트
  const handleClickDeleteBtn = () => {
    if (selectedOptions.length === 0) return;

    let newArr = selectedStationList;
    selectedOptions.forEach(option => {
      newArr = newArr.filter(item => item.siteData != option.innerText);
    });
    setSelectedStationList(newArr);
  };

  // 측정소 적용 버튼 클릭 이벤트
  const handleClickSelectBtn = () => {
    setMultipleStationList(prev => {
      return [...prev, ...selectedStationList].reduce((acc, curr) => {
        if (acc.findIndex(({ siteCd }) => siteCd === curr.siteCd) === -1) {
          acc.push(curr);
        }
        return acc;
      }, []);
    });
    setIsModalOpened(false);
  };

  return (
    <ModalFrame>
      <ModalHeader title="측정소 선택" onClick={handleCloseModal} />
      <ModalContent>
        <TabWrapper>
          <TabButtonWrapper>
            {tabList.map((tab, idx) => (
              <Button
                key={tab.title}
                id={idx}
                className={`${
                  idx === activeTabIndex
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-black'
                } h-full whitespace-nowrap px-4 rounded-t-lg rounded-b-none`}
                onClick={handleClickTabBtn}
              >
                {tab.title}
              </Button>
            ))}
          </TabButtonWrapper>
          {/* tms 설정 on/off에 따라.. */}
          <div className="flex flex-row h-9 gap-2.5 items-stretch justify-center py-1 px-2.5 mb-1 bg-gray-200 rounded-sm">
            <span className="flex items-center text-sm font-semibold">TMS</span>
            <Select
              defaultValue={tms.airqltKndNm}
              onChange={handleChangeAirqltKndNm}
              className="w-fit"
            >
              {TmsOptionList.map(tms => (
                <option key={tms.text} value={tms.text}>
                  {tms.text}
                </option>
              ))}
            </Select>
            <label className="flex items-center text-sm">
              <Input
                type="checkbox"
                onChange={handleChangeProgressYn}
                className="mr-1.5"
              />
              추이 측정소
            </label>
          </div>
        </TabWrapper>
        {tabList.map((tab, idx) => (
          <TabContentWrapper
            key={idx}
            className={`${
              activeTabIndex === idx
                ? 'grid grid-cols-2 gap-1 justify-stretch'
                : 'hidden'
            }`}
          >
            {tab.content}
            <div className="flex flex-col w-full h-full box-border border-1 border-gray-300">
              <div className="flex items-center justify-center w-full h-10 border-b-2 border-b-gray-200 bg-gray-200 font-semibold">
                선택한 측정소
              </div>
              <Select
                multiple
                onChange={handleChangeMultipleSelect}
                className="grow border-none"
              >
                {selectedStationList &&
                  selectedStationList.map(station => (
                    <option key={station.siteCd}>{station.siteData}</option>
                  ))}
              </Select>
              <div className="flex flex-row gap-0.5 items-center justify-end p-1 border-t-2 border-t-gray-200">
                <Button onClick={handleClickDeleteBtn} className="w-fit px-3">
                  선택 삭제
                </Button>
                <Button
                  onClick={() => setSelectedStationList([])}
                  className="w-fit px-3"
                >
                  전체 삭제
                </Button>
              </div>
            </div>
          </TabContentWrapper>
        ))}
      </ModalContent>
      <ModalFooter>
        <Button
          className="w-80 bg-blue-600 text-white text-lg"
          onClick={handleClickSelectBtn}
        >
          측정소 적용
        </Button>
      </ModalFooter>
    </ModalFrame>
  );
};

export { SearchStationModal };

const RegionOptionList = [
  { text: '전국' },
  { text: '수도권' },
  { text: '서울' },
  { text: '경기' },
  { text: '인천' },
  { text: '대전' },
  { text: '대구' },
  { text: '부산' },
  { text: '울산' },
  { text: '광주' },
  { text: '세종' },
  { text: '강원' },
  { text: '충북' },
  { text: '충남' },
  { text: '전북' },
  { text: '전남' },
  { text: '경북' },
  { text: '경남' },
  { text: '제주' },
];

const TmsOptionList = [
  { text: '전체' },
  { text: '도시대기' },
  { text: '도로변대기' },
  { text: '국가배경' },
  { text: '교외대기' },
  { text: '항만' },
  { text: '선박권역' },
  { text: '선박' },
  { text: '고고도관측' },
];

const EtcRadioBtnList = [
  { text: '전국' },
  { text: '수도권' },
  { text: '도청 소재 도시' },
  { text: '15개 주요 항만' },
];

const TabWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between w-full h-9',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TabWrapper.displayName = 'TabWrapper';

const TabButtonWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-row gap-0.5 h-full', className)} {...props}>
      {children}
    </div>
  );
};
TabButtonWrapper.displayName = 'TabButtonWrapper';

const TabContentWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('grow p-5 box-border border-1 border-blue-900', className)}
      {...props}
    >
      {children}
    </div>
  );
};
TabContentWrapper.displayName = 'TabContentWrapper';

const SearchStationWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('grid grid-cols-[6fr_1fr] gap-2', className)} {...props}>
      {children}
    </div>
  );
};
SearchStationWrapper.displayName = 'SearchStationWrapper';

const ButtonWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </div>
  );
};
ButtonWrapper.displayName = 'ButtonWrapper';

const SelectBoxWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-col box-border border-1 border-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
SelectBoxWrapper.displayName = 'SelectBoxWrapper';

const SelectBoxTitle = ({ type, className, children, ...props }) => {
  const css =
    type === 'text'
      ? 'flex items-center justify-center w-full h-10 border-b-2 border-b-gray-200 bg-gray-200 font-semibold'
      : 'grid grid-cols-[1fr_2fr_0.7fr] gap-1 p-0.5 h-10 border-b-2 border-b-gray-200 bg-gray-200 text-sm';

  return (
    <div className={cn(css, className)} {...props}>
      {children}
    </div>
  );
};
SelectBoxTitle.displayName = 'SelectBoxTitle';
