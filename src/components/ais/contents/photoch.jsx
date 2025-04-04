/**
 * 광화학 컴포넌트
 * [광화학 데이터 그래프 | 광화학 성분 파이그래프 | ]
 * chartType => 'line' || 'pie' || 'bar'
 *
 */

import { useState } from 'react';
import usePostRequest from '@/hooks/usePostRequest';

import { SearchFrame } from '../search-frame';
import { SearchDate } from '../search-date';
import { SearchStation } from '../search-station';
import { SearchCond } from '../search-cond';
import { SearchPollutant } from '../search-pollutant';
import { ContentTableFrame } from '../content-table-frame';
import { ContentChartFrame } from '../content-chart-frame';

const PhotoCh = ({ chartType }) => {
  const postMutation = usePostRequest();

  // chartType에 따라 검색 조건 설정
  const config = PHOTOCH_SETTINGS[chartType];

  // 검색 조건 설정
  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [searchCond, setSearchCond] = useState({
    sect: config.sect,
    region: config.region,
    stats: 'avg',
    unit: 'ppbV',
    digit: 3,
    percentile: 0.99,
    statsDisabled: false,
  });
  const [pollutant, setPollutant] = useState([
    { id: 'Low', checked: true, signvalue: '#' },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  const handleClickSearchBtn = async () => {
    if (!dateList.length) return alert('기간을 설정하여 주십시오.');
    if (!stationList.length) return alert('측정소를 설정하여 주십시오.');
    if (postMutation.isLoading) return;

    setIsLoading(true);
    setContentData(undefined);

    const apiData = {
      page: `photoch/${chartType}Graph`,
      date: dateList,
      site: stationList,
      cond: searchCond,
      polllist: pollutant,
      type: chartType,
    };

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
  };

  return (
    <>
      <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
        <SearchDate setDateList={setDateList} />
        <SearchStation
          title="광화학"
          siteType="photoch"
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
        fileName="광화학 분석"
      />
      <ContentChartFrame
        datas={contentData}
        isLoading={isLoading}
        type={chartType}
        title="광화학"
      />
    </>
  );
};

export { PhotoCh };

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
      { value: 'accmonth', text: '월별누적' },
      { value: 'accseason', text: '계절관리제누적' },
      { value: 'a1', text: '계절관리제연차누적' },
      { value: 'a2', text: '년도-일별누적' },
      { value: 'a3', text: '전체-일별누적' },
      { value: 'a4', text: '년도-시간대별' },
      { value: 'a5', text: '전체-월별' },
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

const PHOTOCH_SETTINGS = {
  line: {
    condList: condList,
    sect: 'time',
    region: 'site',
  },
  pie: {
    condList: pieCondList,
    sect: 'all',
    region: 'all',
  },
  bar: {
    condList: condList,
    sect: 'time',
    region: 'site',
  },
};
