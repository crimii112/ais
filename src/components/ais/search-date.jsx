import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { SearchCondFrame } from './search-cond-frame';
import {
  FlexRowWrapper,
  FlexColWrapper,
  Button,
  Input,
} from '@/components/ui/common';
import { Select, Option } from '@/components/ui/select-box';
import usePostRequest from '@/hooks/usePostRequest';


/**
 * 기간 선택 컴포넌트
 * - dateType에 따라 선택 항목이 달라집니다.
 * 1. 'all': 년-월-일 시간 선택
 * 2. 'day': 년-월-일 선택
 * @param {function} setDateList - 기간 리스트 설정 함수
 * @param {string} dateType - 기간 타입 ['all', 'day']
 * @param {string} type - 기간 타입 ['photoch', 'toxic', 'intensive']
 * @returns {React.ReactNode} 기간 선택 컴포넌트
 */


const SearchDate = ({ setDateList, dateType = 'all', type }) => {
  const postMutation = usePostRequest();
  const [multipleDateList, setMultipleDateList] = useState([]);

  // select, input 요소
  const dataCategoryRef = useRef();
  const startDateRef = useRef();
  const startTimeRef = useRef();
  const endDateRef = useRef();
  const endTimeRef = useRef();

  const multipleSelectRef = useRef();

  useEffect(() => {
    setDateList(multipleDateList);
  }, [multipleDateList]);

  // 기간 선택 버튼 클릭 이벤트
  const handleClickSelectDate = async () => {
    const dataCategory = dataCategoryRef.current.value;
    let startDateTime = '',
      endDateTime = '';
    if (dateType === 'all') {
      startDateTime = `${startDateRef.current.value} ${startTimeRef.current.value}`;
      endDateTime = `${endDateRef.current.value} ${endTimeRef.current.value}`;
    } else if (dateType === 'day') {
      startDateTime = `${startDateRef.current.value} 01`;
      endDateTime = `${endDateRef.current.value} 24`;
    }

    if (moment(startDateTime) > moment(endDateTime)) {
      alert('입력하신 끝 날짜가 시작 날짜보다 빠릅니다.');
      return;
    }

    // 겹치는 기간 제외
    // return => 겹치면 item, 안겹치면 undefined
    const isPeriodConflict = multipleDateList.find(item => {
      // multiple select box item
      const itemStartDateStr = item.substr(7, 13);
      const itemEndDateStr = item.substr(21, 13);
      const itemStartDate = itemStartDateStr.replaceAll('/', '-');
      const itemEndDate = itemEndDateStr.replaceAll('/', '-');

      // search date
      const searchStartDate = startDateTime;
      const searchEndDate = endDateTime;

      return !(searchEndDate < itemStartDate || searchStartDate > itemEndDate);
    });

    if (isPeriodConflict) {
      alert('기간이 겹치지 않게 선택해 주십시오.');
      return;
    }

    let item = [];
    //auto => api 호출(select box 값 전송)
    if (dataCategoryRef.current.value === 'auto') {
      if (postMutation.isLoading) return;

      const apiData = {
        date: [
          startDateTime.replaceAll('-', '').replace(' ', '') +
            ';' +
            endDateTime.replaceAll('-', '').replace(' ', ''),
        ],
        ...(type !== undefined && { type: type }),
      };

      const apiRes = await postMutation.mutateAsync({
        url: '/ais/srch/date.do',
        data: apiData,
      });

      item = apiRes.filter(item => item);
    } else {
      //실시간/1차확정/확정 => 수동
      item = [
        dataCategory +
          ';' +
          startDateTime.replaceAll('-', '/') +
          ';' +
          endDateTime.replaceAll('-', '/'),
      ];
    }

    setMultipleDateList(prev => [...prev, ...item]);
  };

  // 선택 삭제 버튼 클릭 이벤트
  const handleClickDeleteSelected = () => {
    const selectedItems = Array.from(multipleSelectRef.current.selectedOptions);

    if (selectedItems != null) {
      let newArr = multipleDateList;
      selectedItems.forEach(option => {
        newArr = newArr.filter(listItem => listItem != option.value);
      });
      setMultipleDateList(newArr);
    }
  };

  // 전체 삭제 버튼 클릭 이벤트
  const handleClickDeleteAll = () => setMultipleDateList([]);

  // 기간 선택 컴포넌트 - 년-월-일 시간 선택
  const allDateSelect = (
    <>
      <Select ref={dataCategoryRef} className={'min-w-fit'}>
        <option value="auto">자동 선택</option>
        <option value="DATAR0">실시간 자료</option>
        <option value="DATAR1">1차 확정 자료</option>
        <option value="DATARF">확정 자료</option>
      </Select>
      <Input
        type="date"
        defaultValue={'2015-01-01'}
        ref={startDateRef}
        className="px-2"
      />
      <Select defaultValue={'01'} ref={startTimeRef}>
        {times.map(time => (
          <option key={time.value} value={time.value}>
            {time.text}
          </option>
        ))}
      </Select>
      &nbsp;~&nbsp;
      <Input
        type="date"
        defaultValue={'2015-01-31'}
        ref={endDateRef}
        className="px-2"
      />
      <Select defaultValue={'24'} ref={endTimeRef}>
        {times.map(time => (
          <option key={time.value} value={time.value}>
            {time.text}
          </option>
        ))}
      </Select>
    </>
  );

  // 기간 선택 컴포넌트 - 년-월-일 선택
  const daySelect = (
    <>
      <Select ref={dataCategoryRef} className="w-[130px]">
        <option value="auto">자동 선택</option>
        <option value="DATAR0">실시간 자료</option>
        <option value="DATAR1">1차 확정 자료</option>
        <option value="DATARF">확정 자료</option>
      </Select>
      <Input
        type="date"
        defaultValue={'2015-01-01'}
        ref={startDateRef}
        className="px-4"
      />
      &nbsp;~&nbsp;
      <Input
        type="date"
        defaultValue={'2015-01-31'}
        ref={endDateRef}
        className="px-4"
      />
    </>
  );

  return (
    <SearchCondFrame title="기간">
      <FlexRowWrapper className="items-stretch gap-1 w-full">
        <FlexRowWrapper className="items-stretch grow gap-1 justify-baseline">
          {dateType === 'all' && allDateSelect}
          {dateType === 'day' && daySelect}
        </FlexRowWrapper>
        <FlexColWrapper className="w-23 gap-0.5 justify-between items-start">
          <Button
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
            onClick={handleClickSelectDate}
          >
            기간 선택
          </Button>
        </FlexColWrapper>
      </FlexRowWrapper>
      <FlexRowWrapper className="items-stretch gap-1 w-full">
        <FlexRowWrapper className="items-stretch grow">
          <Select multiple ref={multipleSelectRef}>
            {multipleDateList &&
              multipleDateList.map(item => <Option key={item}>{item}</Option>)}
          </Select>
        </FlexRowWrapper>
        <FlexColWrapper className="w-23 gap-0.5 justify-between items-start">
          <Button className="px-0 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
            관리기간선택
          </Button>
          <Button onClick={handleClickDeleteSelected}>선택 삭제</Button>
          <Button onClick={handleClickDeleteAll}>전체 삭제</Button>
        </FlexColWrapper>
      </FlexRowWrapper>
    </SearchCondFrame>
  );
};

export { SearchDate };

const times = [
  { value: '01', text: '01' },
  { value: '02', text: '02' },
  { value: '03', text: '03' },
  { value: '04', text: '04' },
  { value: '05', text: '05' },
  { value: '06', text: '06' },
  { value: '07', text: '07' },
  { value: '08', text: '08' },
  { value: '09', text: '09' },
  { value: '10', text: '10' },
  { value: '11', text: '11' },
  { value: '12', text: '12' },
  { value: '13', text: '13' },
  { value: '14', text: '14' },
  { value: '15', text: '15' },
  { value: '16', text: '16' },
  { value: '17', text: '17' },
  { value: '18', text: '18' },
  { value: '19', text: '19' },
  { value: '20', text: '20' },
  { value: '21', text: '21' },
  { value: '22', text: '22' },
  { value: '23', text: '23' },
  { value: '24', text: '24' },
];
