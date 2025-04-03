import { useState } from 'react';
import usePostRequest from '@/hooks/usePostRequest';

import { SearchFrame } from '../search-frame';
import { SearchDate } from '../search-date';
import { SearchStation } from '../search-station';
import { SearchCond } from '../search-cond';
import { SearchPollutant } from '../search-pollutant';
import { ContentTableFrame } from '../content-table-frame';

const CmmnAir = () => {
  const postMutation = usePostRequest();

  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [searchCond, setSearchCond] = useState({
    sect: 'time',
    region: 'sido',
    stats: 'avg',
    sort: 'groupdate',
    dust: 'include',
    usertime: '',
  });
  const [pollutant, setPollutant] = useState([
    { id: 'so2', checked: true, signvalue: 3, signvalue2: 4 },
    { id: 'no2', checked: true, signvalue: 3, signvalue2: 4 },
    { id: 'o3', checked: true, signvalue: 3, signvalue2: 4 },
    { id: 'co', checked: true, signvalue: 1, signvalue2: 2 },
    { id: 'pm10', checked: true, signvalue: 0, signvalue2: 0 },
    { id: 'pm25', checked: true, signvalue: 0, signvalue2: 0 },
    { id: 'no', checked: false, signvalue: 3, signvalue2: 4 },
    { id: 'nox', checked: false, signvalue: 3, signvalue2: 4 },
    { id: 'wd', checked: false, signvalue: 0, signvalue2: 0 },
    { id: 'ws', checked: false, signvalue: 1, signvalue2: 1 },
    { id: 'tmp', checked: false, signvalue: 1, signvalue2: 1 },
    { id: 'hum', checked: false, signvalue: 1, signvalue2: 1 },
    { id: 'High', checked: true, signvalue: '#' },
    { id: 'Low', checked: true, signvalue: '##' },
  ]);

  // api result data
  const [contentData, setContentData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleClickSearchBtn = async () => {
    if (dateList.length === 0) {
      alert('기간을 설정하여 주십시오.');
      return;
    }
    if (stationList.length === 0) {
      alert('대기측정소를 설정하여 주십시오.');
      return;
    }

    if (postMutation.isLoading) return;

    setIsLoading(true);
    const apiData = {
      page: 'arpltn/cmmair',
      date: dateList,
      site: stationList,
      cond: searchCond,
      polllist: pollutant,
    };
    let apiRes = await postMutation.mutateAsync({
      url: '/ais/srch/datas.do',
      data: apiData,
    });
    setIsLoading(false);
    console.log(apiData);
    console.log(apiRes);

    /*
     * 검색조건-데이터구분==='월별누적||계절관리제누적||계절관리제연차누적||년도일별누적||전체일별누적||계절관리제일별누적' &&
     * 물질및소수점자릿수-온도||습도==='checked'일 경우 NO DATA로 처리
     */
    if (JSON.stringify(apiRes) === '{}') {
      apiRes.data = {
        headList: ['NO DATA'],
        headNameList: ['NO DATA'],
        rstList: ['NO DATA'],
      };
    }

    setContentData(apiRes);
  };

  return (
    <>
      <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
        <SearchDate setDateList={setDateList} />
        <SearchStation title="대기측정소" setStationList={setStationList} />
        <SearchCond
          condList={condList}
          initialSearchCond={searchCond}
          setSearchCond={setSearchCond}
        />
        <SearchPollutant
          pollutantList={pollutantList}
          signList={signList}
          initialPollutant={pollutant}
          setPollutant={setPollutant}
        />
      </SearchFrame>
      <ContentTableFrame
        datas={contentData}
        isLoading={isLoading}
        fileName="일반대기 검색"
      />
    </>
  );
};

export { CmmnAir };

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
      { value: 'sido', text: '시도' },
      { value: 'city', text: '도시' },
      { value: 'all', text: '전체' },
      { value: 'reg1', text: '예보권역1' },
      { value: 'reg2', text: '예보권역2' },
      { value: 'site', text: '측정소별' },
      { value: 'adminregion', text: '지자체별' },
      { value: 'ozone', text: '오존경보권역' },
      { value: 'pmregion', text: '미세먼지경보권역' },
      { value: 'airregion', text: '대기관리권역' },
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
    ],
  },
  {
    type: 'selectBox',
    title: '데이터정렬',
    id: 'sort',
    content: [
      { value: 'groupdate', text: '시간' },
      { value: 'so2', text: 'SO2' },
      { value: 'no2', text: 'NO2' },
      { value: 'o3', text: 'O3' },
      { value: 'co', text: 'CO' },
      { value: 'pm10', text: 'PM10' },
      { value: 'pm25', text: 'PM2.5' },
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
  {
    type: 'textInput',
    title: '사용자 시간입력',
    id: 'usertime',
    placeholder: '예:13,14(가동율 산정안됨)',
  },
];

const pollutantList = [
  {
    id: 'so2',
    text: (
      <>
        SO<sub>2</sub>
      </>
    ),
    checked: true,
    signvalue: 3,
    signvalue2: 4,
  },
  {
    id: 'no2',
    text: (
      <>
        NO<sub>2</sub>
      </>
    ),
    checked: true,
    signvalue: 3,
    signvalue2: 4,
  },
  {
    id: 'o3',
    text: (
      <>
        O<sub>3</sub>
      </>
    ),
    checked: true,
    signvalue: 3,
    signvalue2: 4,
  },
  { id: 'co', text: 'CO', checked: true, signvalue: 1, signvalue2: 2 },
  {
    id: 'pm10',
    text: (
      <>
        PM<sub>10</sub>
      </>
    ),
    checked: true,
    signvalue: 0,
    signvalue2: 0,
  },
  {
    id: 'pm25',
    text: (
      <>
        PM<sub>2.5</sub>
      </>
    ),
    checked: true,
    signvalue: 0,
    signvalue2: 0,
  },
  { id: 'no', text: 'NO', checked: false, signvalue: 3, signvalue2: 4 },
  {
    id: 'nox',
    text: (
      <>
        NO<sub>x</sub>
      </>
    ),
    checked: false,
    signvalue: 3,
    signvalue2: 4,
  },
  { id: 'wd', text: '풍향', checked: false, signvalue: 0, signvalue2: 0 },
  { id: 'ws', text: '풍속', checked: false, signvalue: 1, signvalue2: 1 },
  { id: 'tmp', text: '온도', checked: false, signvalue: 1, signvalue2: 1 },
  { id: 'hum', text: '습도', checked: false, signvalue: 1, signvalue2: 1 },
];

const signList = [
  { id: 'High', text: '~75% 미만', checked: true, signvalue: '#' },
  { id: 'Low', text: '~50% 미만', checked: true, signvalue: '##' },
];
