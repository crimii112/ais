import { useCallback, useMemo, useState, useEffect } from 'react';
import usePostRequest from '@/hooks/usePostRequest';

import { SearchFrame } from '@/components/ais/search-frame';
import { SearchDate } from '@/components/ais/search-date';
import { SearchStation } from '@/components/ais/search-station';
import { SearchPollutant } from '@/components/ais/search-pollutant';
import { SearchCond } from '@/components/ais/search-cond';
import { ContentTableFrame } from '@/components/ais/content-table-frame';

/**
 * 대기환경연구소 페이지 데이터 프레임 컴포넌트
 * - 대기환경연구소는 검색 부분이 거의 비슷하기 때문에 공통 컴포넌트로 분리
 * - 검색 조건 설정 컴포넌트 및 결과 테이블 컴포넌트 사용
 * - 그래프 그리는 부분은 각 페이지에서 구현
 * - 맨 아래 INTENSIVE_SETTINGS 변수에 페이지 타입별 설정 정보 저장
 * @param {React.ReactNode} children 자식 컴포넌트
 * @param {string} type 페이지 타입
 * @param {function} onDataLoaded 데이터 로드 시 실행할 함수
 * @param {function} onLoadingChange 로딩 상태 변경 시 실행할 함수
 * @param {function} initSettings 설정 초기화 함수
 * @param {string} highlightedRow 하이라이트 표시할 행의 rowKey
 * @example type = 'psize' | 'autoTimeCorrelation' | 'autoGraph'
 * @returns {React.ReactNode} 대기환경연구소 페이지 데이터 프레임 컴포넌트
 */
const IntensiveDataFrame = ({ children, type, onDataLoaded, onLoadingChange, initSettings, highlightedRow }) => {
  const config = INTENSIVE_SETTINGS[type];
  const postMutation = usePostRequest();

  // 검색 조건 설정
  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [pollutant, setPollutant] = useState(config.initPollutant);
  const [searchCond, setSearchCond] = useState(config.initCond);

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  // isLoading 상태가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const apiData = useMemo(
    () => ({
      page: config.page,
      date: dateList,
      site: stationList,
      ...(config.markList ? { cond: searchCond[0] } : { cond: searchCond }),
      ...(config.markList
        ? { mark: searchCond.slice(1) }
        : {
            mark: [
              { id: 'unit1', checked: false },
              { id: 'unit2', checked: false },
            ],
          }),
      ...(config.digitList
        ? { digitlist: pollutant[0] }
        : {
            digitlist: { pm: 1, lon: 3, carbon: 1, metal: 1, gas: 1, other: 6 },
          }),
      ...(config.digitList
        ? { polllist: pollutant.slice(1) }
        : { polllist: pollutant }),
    }),
    [dateList, stationList, searchCond, pollutant]
  );

  const handleClickSearchBtn = useCallback(async () => {
    if (!dateList.length) return alert('기간을 설정하여 주십시오.');
    if (!stationList.length) return alert('측정소를 설정하여 주십시오.');
    if (postMutation.isLoading) return;

    initSettings && initSettings();
    setIsLoading(true);
    setContentData(undefined);

    try {
      let apiRes = await postMutation.mutateAsync({
        url: 'ais/srch/datas.do',
        data: apiData,
      });

      if (JSON.stringify(apiRes) === '{}') {
        apiRes = {
          headList: ['NO DATA'],
          headNameList: ['NO DATA'],
          rstList: ['NO DATA'],
        };
      }

      setContentData(apiRes);

      if (onDataLoaded) {
        onDataLoaded(apiRes);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiData, postMutation, onDataLoaded]);

  return (
    <>
      {/* 데이터 검색 조건 설정 */}
      <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
        <SearchDate setDateList={setDateList} type="intensive" dateType={config.dateType} />
        <SearchStation
          title="대기환경연구소"
          siteType="intensive"
          onTms={false}
          setStationList={setStationList}
        />
        <SearchPollutant
          title={config.digitList ? '물질 및 소수점 자릿수' : '자료획득률'}
          digitList={config.digitList}
          signList={config.signList}
          initialPollutant={pollutant}
          setPollutant={setPollutant}
        />
        <SearchCond
          condList={config.condList}
          markList={config.markList}
          initialSearchCond={searchCond}
          setSearchCond={setSearchCond}
        />
      </SearchFrame>

      {/* 결과 테이블 */}
      <ContentTableFrame
        datas={contentData}
        isLoading={isLoading}
        fileName={config.title}
        highlightedRow={highlightedRow}
        numberStartIndex={config.numberStartIndex}
        numberEndIndex={config.numberEndIndex}
      />

      {children}
    </>
  );
};

export { IntensiveDataFrame };

// 초기 검색 조건 설정값
const initCond = {
  sect: 'time',
  poll: 'calc',
  dust: 'include',
  stats: '',
  eqType: 'SMPS_APS_O',
};
const initCond_2 = [
  {
    sect: 'time',
    poll: 'calc',
    dust: 'include',
    stats: '',
    eqType: 'SMPS_APS_O',
  },
  { id: 'unit1', checked: false }, // markList
  { id: 'unit2', checked: false },
];
const initCond_3 = [
  {
    sect: 'day',
    poll: 'calc',
    dust: 'include',
    stats: '',
    eqType: 'SMPS_APS_O',
  },
  { id: 'unit1', checked: false }, // markList
  { id: 'unit2', checked: false },
]

// 초기 물질 및 소수점 자릿수 설정값
const initPollutant_1 = [
  { id: 'High', checked: true, signvalue: '#' },
  { id: 'Low', checked: true, signvalue: '##' },
  { id: 'dumy', checked: false },
];
const initPollutant_2 = [
  { pm: 1, lon: 3, carbon: 1, metal: 1, gas: 1, other: 6 },
  { id: 'High', checked: true, signvalue: '#' },
  { id: 'Low', checked: true, signvalue: '##' },
  { id: 'dumy', checked: false },
];

// 자료획득률 조건 데이터 => searchPollutant 컴포넌트에서 사용
const signList = [
  { id: 'High', text: '~75% 미만', checked: true, signvalue: '#' },
  { id: 'Low', text: '~50% 미만', checked: true, signvalue: '##' },
];
// 검색 조건 데이터 => searchCond 컴포넌트에서 사용
const condList_1 = [
  {
    type: 'selectBox',
    title: '데이터구분',
    id: 'sect',
    content: [
      { value: 'time', text: '시간별' },
      { value: 'day', text: '일별' },
      { value: 'month', text: '월별' },
      { value: 'year', text: '연별' },
      { value: 'all', text: '전체기간별' },
      { value: 'timezone', text: '시간대별' },
      { value: 'week', text: '요일별' },
      { value: 'season', text: '계절별' },
      { value: 'ys', text: '년도-계절별' },
      { value: 'lys', text: '전년도-계절별' },
      { value: 'a4', text: '년도-시간대별' },
      { value: 'a5', text: '전체-월별' },
      { value: 'a7', text: '전체-일별' },
      { value: 'accmonth', text: '년도-월별누적' },
      { value: 'accseason', text: '계절관리제누적' },
      { value: 'a1', text: '계절관리제연차누적' },
      { value: 'a2', text: '년도-일별누적' },
      { value: 'a3', text: '전체-일별누적' },
      { value: 'a6', text: '계절관리제일별누적' },
    ],
  },
  {
    type: 'selectBox',
    title: '검색항목',
    id: 'poll',
    content: [{ value: 'calc', text: '성분계산' }],
    disabled: true,
  },
  {
    type: 'selectBox',
    title: '황사구분',
    id: 'dust',
    content: [
      { value: 'include', text: '황사기간포함' },
      { value: 'except', text: '황사기간제외' },
      { value: 'only', text: '황사기간만' },
    ],
  },
  {
    type: 'selectBox',
    title: '입경구분',
    id: 'eqType',
    content: [
      { value: 'SMPS_APS_O', text: 'SMPS_APS_O' },
      { value: 'SMPS_APS', text: 'SMPS_APS' },
      { value: 'SMPS', text: 'SMPS' },
      { value: 'APS', text: 'APS' },
    ],
  },
];
const condList_2 = [
  {
    type: 'selectBox',
    title: '데이터구분',
    id: 'sect',
    content: [
      { value: 'time', text: '시간별' },
      { value: 'day', text: '일별' },
      { value: 'month', text: '월별' },
      { value: 'year', text: '연별' },
      { value: 'all', text: '전체기간별' },
      { value: 'timezone', text: '시간대별' },
      { value: 'week', text: '요일별' },
      { value: 'season', text: '계절별' },
      { value: 'ys', text: '년도-계절별' },
      { value: 'lys', text: '전년도-계절별' },
      { value: 'a4', text: '년도-시간대별' },
      { value: 'a5', text: '전체-월별' },
      { value: 'a7', text: '전체-일별' },
      { value: 'accmonth', text: '년도-월별누적' },
      { value: 'accseason', text: '계절관리제누적' },
      { value: 'a1', text: '계절관리제연차누적' },
      { value: 'a2', text: '년도-일별누적' },
      { value: 'a3', text: '전체-일별누적' },
      { value: 'a6', text: '계절관리제일별누적' },
    ],
  },
  {
    type: 'selectBox',
    title: '검색항목',
    id: 'poll',
    content: [{ value: 'calc', text: '성분계산' }],
    disabled: true,
  },
  {
    type: 'selectBox',
    title: '황사구분',
    id: 'dust',
    content: [
      { value: 'include', text: '황사기간포함' },
      { value: 'except', text: '황사기간제외' },
      { value: 'only', text: '황사기간만' },
    ],
  },
];
const condList_3 = [
  {
    type: 'selectBox',
    title: '데이터구분',
    id: 'sect',
    content: [
      { value: 'time', text: '시간별' },
      { value: 'day', text: '일별' },
      { value: 'month', text: '월별' },
      { value: 'year', text: '연별' },
      { value: 'all', text: '전체기간별' },
      { value: 'timezone', text: '시간대별' },
      { value: 'week', text: '요일별' },
      { value: 'season', text: '계절별' },
      { value: 'ys', text: '년도-계절별' },
      { value: 'lys', text: '전년도-계절별' },
      { value: 'a4', text: '년도-시간대별' },
      { value: 'a5', text: '전체-월별' },
      { value: 'a7', text: '전체-일별' },
      { value: 'accmonth', text: '년도-월별누적' },
      { value: 'accseason', text: '계절관리제누적' },
      { value: 'a1', text: '계절관리제연차누적' },
      { value: 'a2', text: '년도-일별누적' },
      { value: 'a3', text: '전체-일별누적' },
      { value: 'a6', text: '계절관리제일별누적' },
    ],
  },
  {
    type: 'selectBox',
    title: '검색항목',
    id: 'poll',
    content: [
      { value: 'calc', text: '성분계산' },
      { value: 'raw', text: 'RawData' },
    ],
  },
  {
    type: 'selectBox',
    title: '황사구분',
    id: 'dust',
    content: [
      { value: 'include', text: '황사기간포함' },
      { value: 'except', text: '황사기간제외' },
      { value: 'only', text: '황사기간만' },
    ],
  },
];
const condList_4 = [
  {
    type: 'selectBox',
    title: '데이터구분',
    id: 'sect',
    content: [
      { value: 'day', text: '일별' },
      { value: 'month', text: '월별' },
      { value: 'year', text: '연별' },
      { value: 'all', text: '전체기간별' },
      { value: 'week', text: '요일별' },
      { value: 'season', text: '계절별' },
      { value: 'ys', text: '년도-계절별' },
      { value: 'lys', text: '전년도-계절별' },
      { value: '', text: '월별누적' },
      { value: 'accseason', text: '계절관리제누적' },
      { value: 'allbymonth', text: '전체기간월별' },
    ],
  },
  {
    type: 'selectBox',
    title: '검색항목',
    id: 'poll',
    content: [
      { value: 'calc', text: '성분계산' },
      { value: 'raw', text: 'RawData' },
    ],
  },
  {
    type: 'selectBox',
    title: '황사구분',
    id: 'dust',
    content: [
      { value: 'include', text: '황사기간포함' },
      { value: 'except', text: '황사기간제외' },
      { value: 'only', text: '황사기간만' },
    ],
  },
];
// 성분 데이터 => searchPollutant 컴포넌트에서 사용
const digitList = [
  {
    id: 'pm',
    text: 'PM',
    value: 1,
  },
  {
    id: 'lon',
    text: 'lon',
    value: 3,
  },
  {
    id: 'carbon',
    text: 'Carbon',
    value: 1,
  },
  {
    id: 'metal',
    text: 'Metal',
    value: 1,
  },
  {
    id: 'gas',
    text: 'Gas',
    value: 1,
  },
];
// 성분 자료 Not Null 및 단위표출 조건 데이터 => searchCond 컴포넌트에서 사용
const markList = [
  {
    title: '성분 자료 Not Null',
    id: 'unit1',
    checked: false,
  },
  {
    title: '단위표출',
    id: 'unit2',
    checked: false,
  },
];

// 대기환경연구소 페이지별 세팅
const INTENSIVE_SETTINGS = {
  psize: {
    page: 'intensive/psize',
    initCond: initCond,
    initPollutant: initPollutant_1,
    condList: condList_1,
    signList: signList,
    title: '(단일)입경크기분포',
    numberStartIndex: 4,
    numberEndIndex: 108,
    dateType: 'all'
  },
  autoTimeCorrelation: {
    page: 'intensive/autotimecorrelation',
    initCond: initCond_2,
    initPollutant: initPollutant_2,
    condList: condList_3,
    markList: markList,
    digitList: digitList,
    signList: signList,
    title: '자동-(단일)성분상관성검토',
    numberStartIndex: 3,
    numberEndIndex: 20,
    dateType: 'all'
  },
  autoGraph: {
    page: 'intensive/autograph',
    initCond: initCond_2,
    initPollutant: initPollutant_2,
    condList: condList_2,
    markList: markList,
    digitList: digitList,
    signList: signList,
    title: '자동-(단일)성분누적그래프',
    numberStartIndex: 3,
    numberEndIndex: 20,
    dateType: 'all'
  },
  autoPieGraph: {
    page: 'intensive/autopiegraph',
    initCond: initCond_2,
    initPollutant: initPollutant_2,
    condList: condList_2,
    markList: markList,
    digitList: digitList,
    signList: signList,
    title: '자동-(단일)성분파이그래프',
    numberStartIndex: 3,
    numberEndIndex: 20,
    dateType: 'all'
  },
  manualCorrelation: {
    page: 'intensive/manualcorrelation',
    initCond: initCond_3,
    initPollutant: initPollutant_2,
    condList: condList_4,
    markList: markList,
    digitList: digitList,
    signList: signList,
    title: '수동-(단일)성분상관성검토',
    numberStartIndex: 3,
    numberEndIndex: 34,
    dateType: 'day'
  },
  manualGraph: {
    page: 'intensive/manualgraph',
    initCond: initCond_3,
    initPollutant: initPollutant_2,
    condList: condList_4,
    markList: markList,
    digitList: digitList,
    signList: signList,
    title: '수동-(단일)성분누적그래프',
    numberStartIndex: 3,
    numberEndIndex: 16,
    dateType: 'day'
  }
};
