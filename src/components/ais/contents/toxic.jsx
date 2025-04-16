import { useState, useMemo, useCallback } from 'react';
import usePostRequest from '@/hooks/usePostRequest';

import { SearchDate } from '../search-date';
import { SearchFrame } from '../search-frame';
import { SearchStation } from '../search-station';
import { SearchCond } from '../search-cond';
import { SearchPollutant } from '../search-pollutant';
import { ContentTableFrame } from '../content-table-frame';
import { ContentChartFrame } from '../content-chart-frame';


/**
 * 유해대기 컴포넌트
 * - 기간, 측정소, 검색조건, 자료획득률 선택 후 검색 버튼 클릭 시 데이터 조회
 * - [유해대기 그래프 | 유해대기 파이그래프 | 유해대기 막대그래프 | 유해대기 일중간값 그래프]
 * @param {string} type 페이지 타입 ['line' | 'pie' | 'bar' | 'medianLine']
 * @returns {React.ReactNode} 유해대기 컴포넌트
 */


const Toxic = ({ type }) => {
  const postMutation = usePostRequest();
  const config = TOXIC_SETTINGS[type];

  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [searchCond, setSearchCond] = useState(config.initCond);
  const [pollutant, setPollutant] = useState([
    { id: 'Low', checked: true, signvalue: '#' },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  // API 데이터 메모이제이션
  const apiData = useMemo(() => ({
    page: config.page,
    date: dateList,
    site: stationList,
    cond: searchCond,
    polllist: pollutant,
    type: config.type,
  }), [config.page, config.type, dateList, stationList, searchCond, pollutant]);

  // 검색 버튼 핸들러 메모이제이션
  const handleClickSearchBtn = useCallback(async () => {
    if (!dateList.length) return alert('기간을 설정하여 주십시오.');
    if (!stationList.length) return alert('측정소를 설정하여 주십시오.');
    if (postMutation.isLoading) return;

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

      console.log(apiData);
      console.log(apiRes);

      setContentData(apiRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiData, postMutation]);

  return (
    <>
      <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
        <SearchDate
          setDateList={setDateList}
          dateType={config.page === 'toxic/medianGraph' ? 'day' : 'all'}  // 일중간값 그래프 기간 타입(시간 없음)
          type="toxic"
        />
        <SearchStation
          title="유해대기"
          siteType="toxic"
          onTms={false}
          setStationList={setStationList}
        />
        <SearchCond
          condList={config.condList}
          initialSearchCond={searchCond}
          setSearchCond={setSearchCond}
        />
        <SearchPollutant
          title="자료획득률"
          signList={signList}
          initialPollutant={pollutant}
          setPollutant={setPollutant}
        />
      </SearchFrame>

      <ContentTableFrame
        datas={contentData}
        isLoading={isLoading}
        fileName="유해대기 분석"
      />

      <ContentChartFrame
        datas={contentData}
        isLoading={isLoading}
        type={config.chartType}
        title="유해대기"
      />
    </>
  );
};

export { Toxic };

const condList = [
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
    title: '데이터권역',
    id: 'region',
    content: [
      { value: 'site', text: '측정소별' },
      { value: 'sido', text: '시도' },
      { value: 'group1', text: '형별' },
      { value: 'group2', text: '권역별' },
      { value: 'group12', text: '형별/권역별' },
      { value: 'all', text: '전체' },
    ],
  },
  {
    type: 'selectBox',
    title: '데이터통계',
    id: 'stats',
    content: [
      { value: 'avg', text: '평균' },
      { value: 'min', text: '최소' },
      { value: 'max', text: '최대' },
      { value: 'count', text: '개수' },
      { value: 'stdv', text: '표준편차' },
      { value: 'median', text: '중앙값' },
      { value: 'percentile', text: '백분위수' },
    ],
  },
  {
    type: 'selectBox',
    title: '데이터단위',
    id: 'unit',
    content: [
      { value: 'ppb', text: 'ppb' },
      { value: 'ug/m3', text: 'ug/m3' },
    ],
  },
  {
    type: 'textInput',
    title: '퍼센타일',
    id: 'percentile',
    placeholder: '0.99',
    disabled: true,
  },
  {
    type: 'textInput',
    title: '소수점자릿수',
    id: 'digit',
    placeholder: '3',
  },
];

const pieCondList = [
  {
    type: 'selectBox',
    title: '데이터구분',
    id: 'sect',
    content: [{ value: 'all', text: '전체기간별' }],
  },
  {
    type: 'selectBox',
    title: '데이터권역',
    id: 'region',
    content: [{ value: 'all', text: '전체' }],
  },
  {
    type: 'selectBox',
    title: '데이터통계',
    id: 'stats',
    content: [
      { value: 'avg', text: '평균' },
      { value: 'min', text: '최소' },
      { value: 'max', text: '최대' },
      { value: 'count', text: '개수' },
      { value: 'stdv', text: '표준편차' },
      { value: 'median', text: '중앙값' },
      { value: 'percentile', text: '백분위수' },
    ],
  },
  {
    type: 'selectBox',
    title: '데이터단위',
    id: 'unit',
    content: [
      { value: 'ppb', text: 'ppb' },
      { value: 'ug/m3', text: 'ug/m3' },
    ],
  },
  {
    type: 'textInput',
    title: '퍼센타일',
    id: 'percentile',
    placeholder: '0.99',
    disabled: true,
  },
  {
    type: 'textInput',
    title: '소수점자릿수',
    id: 'digit',
    placeholder: '3',
  },
];

const medianCondList = [
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
      { value: 'accmonth', text: '월별누적' },
      { value: 'accseason', text: '계절관리제누적' },
      { value: 'allbymonth', text: '전체기간월별' },
    ],
  },
  {
    type: 'selectBox',
    title: '데이터권역',
    id: 'region',
    content: [
      { value: 'site', text: '측정소별' },
      { value: 'sido', text: '시도' },
      { value: 'group1', text: '형별' },
      { value: 'group2', text: '권역별' },
      { value: 'group12', text: '형별/권역별' },
      { value: 'all', text: '전체' },
    ],
  },
  {
    type: 'selectBox',
    title: '데이터통계',
    id: 'stats',
    content: [
      { value: 'avg', text: '평균' },
      { value: 'min', text: '최소' },
      { value: 'max', text: '최대' },
      { value: 'count', text: '개수' },
      { value: 'stdv', text: '표준편차' },
      { value: 'median', text: '중앙값' },
      { value: 'percentile', text: '백분위수' },
    ],
  },
  {
    type: 'selectBox',
    title: '데이터단위',
    id: 'unit',
    content: [
      { value: 'ppbV', text: 'ppbV' },
      { value: 'ppbC', text: 'ppbC' },
      { value: 'kOH', text: 'kOH' },
    ],
  },
  {
    type: 'textInput',
    title: '퍼센타일',
    id: 'percentile',
    placeholder: '0.99',
    disabled: true,
  },
  {
    type: 'textInput',
    title: '소수점자릿수',
    id: 'digit',
    placeholder: '3',
  },
];

const signList = [
  { id: 'Low', text: '~60% 미만', checked: true, signvalue: '#' },
];

const TOXIC_SETTINGS = {
  line: {
    page: 'toxic/lineGraph',
    chartType: 'line',
    type: 'line',
    initCond: {
      sect: 'time',
      region: 'site',
      stats: 'avg',
      unit: 'ppb',
      digit: 3,
      percentile: 0.99,
    },
    condList: condList,
  },
  pie: {
    page: 'toxic/pieGraph',
    chartType: 'pie',
    type: 'line',
    initCond: {
      sect: 'all',
      region: 'all',
      stats: 'avg',
      unit: 'ppb',
      digit: 3,
      percentile: 0.99,
    },
    condList: pieCondList,
  },
  bar: {
    page: 'toxic/lineGraph',
    chartType: 'bar',
    type: 'line',
    initCond: {
      sect: 'time',
      region: 'site',
      stats: 'avg',
      unit: 'ppb',
      digit: 3,
      percentile: 0.99,
    },
    condList: condList,
  },
  medianLine: {
    page: 'toxic/medianGraph',
    chartType: 'line',
    type: 'line',
    initCond: {
      sect: 'day',
      region: 'site',
      stats: 'avg',
      unit: 'ppb',
      digit: 3,
      percentile: 0.99,
    },
    condList: medianCondList,
  },
};
