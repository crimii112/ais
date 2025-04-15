import { useState } from 'react';
import html2canvas from 'html2canvas';
import usePostRequest from '@/hooks/usePostRequest';

import { SearchFrame } from '../search-frame';
import { SearchDate } from '../search-date';
import { SearchStation } from '../search-station';
import { SearchPollutant } from '../search-pollutant';
import { SearchCond } from '../search-cond';
import { ContentTableFrame } from '../content-table-frame';
import {
  FlexRowWrapper,
  FlexColWrapper,
  Button,
  Select,
  Option,
} from '@/components/ui/common';
import CustomMultiSelect from '@/components/ui/custom-multiple-select';
import { ScatterChart } from '@/components/ui/chart-scatter';

const IntensivePsize = () => {
  const postMutation = usePostRequest();

  // 검색 조건 설정
  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [pollutant, setPollutant] = useState([
    { id: 'High', checked: true, signvalue: '#' },
    { id: 'Low', checked: true, signvalue: '##' },
    { id: 'dumy', checked: false },
  ]);
  const [searchCond, setSearchCond] = useState({
    sect: 'time',
    poll: 'calc',
    dust: 'include',
    stats: '',
    eqType: 'SMPS_APS_O',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  // 그래프 데이터 설정
  const [optionSettings, setOptionSettings] = useState({
    groupdate: [],
    type: [],
    groupNm: [],
  }); // 선택한 그래프 옵션들
  const [options, setOptions] = useState({}); // select box에 들어갈 옵션들
  const [chartSettings, setChartSettings] = useState();

  const handleClickSearchBtn = async () => {
    setChartSettings(undefined);

    if (!dateList.length) return alert('기간을 설정하여 주십시오.');
    if (!stationList.length) return alert('측정소를 설정하여 주십시오.');
    if (postMutation.isLoading) return;

    setIsLoading(true);
    setContentData(undefined);

    const apiData = {
      page: 'intensive/psize',
      date: dateList,
      site: stationList,
      cond: searchCond,
      polllist: pollutant,
      mark: [
        { id: 'unit1', checked: false },
        { id: 'unit2', checked: false },
      ],
      digitlist: { pm: 1, lon: 3, carbon: 1, metal: 1, gas: 1, other: 6 },
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

      const groupdate = [
        ...new Set(apiRes.rstList.map(item => item.groupdate)),
      ];
      const type = [...new Set(apiRes.rstList.map(item => item.type))];
      const groupNm = apiRes.rstList2.map(item => ({
        value: item.groupNm,
        text: item.groupNm,
      }));

      setOptions({
        groupdate: groupdate[0],
        type: type[0],
        groupNm: groupNm[0],
      });

      setOptionSettings({ groupdate, type, groupNm });
      setContentData(apiRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedGroupNms = selectedOptions => {
    setOptions(prev => ({ ...prev, groupNm: selectedOptions }));
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { groupNm, x, type, y } = payload[0].payload;
      return (
        <div className="bg-white p-2.5 border-1 border-gray-300 rounded-md">
          <p className="font-semibold pb-1">{groupNm}</p>
          <p>{`μg/m³ : ${x}`}</p>
          <p>{`${type} : ${y}`}</p>
        </div>
      );
    }
    return null;
  };

  // 그래프 그리기 버튼 클릭 핸들러
  const handleClickDrawChart = () => {
    const rawData = contentData.rstList.filter(
      data =>
        data.groupdate === options.groupdate &&
        options.groupNm.some(item => item.value === data.groupNm) &&
        data.type === options.type
    );

    if (!rawData.length) {
      alert('그래프를 그릴 데이터가 없습니다. 조건을 확인해주세요.');
      return;
    }

    const processedData = rawData.flatMap(
      ({ groupdate, groupNm, type, ...dataPoints }) =>
        Object.entries(dataPoints)
          .filter(([key, _]) => !isNaN(key))
          .map(([key, value]) => ({
            groupdate,
            groupNm,
            type,
            x: Number(key) / 10,
            y: parseFloat(value),
          }))
    );

    const groupedData = processedData.reduce((acc, curr) => {
      acc[curr.groupNm] = acc[curr.groupNm] || [];
      acc[curr.groupNm].push(curr);
      return acc;
    }, {});

    setChartSettings({
      xAxis: {
        dataKey: 'x',
        scale: 'log',
        domain: [10.6, 10000],
        ticks: [10, 100, 1000, 10000],
      },
      yAxis: {
        dataKey: 'y',
        label: `${options.type} (${typeUnits[options.type]})`,
      },
      data: groupedData,
      tooltip: CustomTooltip,
    });
  };

  // 그래프 이미지로 저장
  const handleSaveImage = async () => {
    await document.fonts.ready;
    const canvas = await html2canvas(
      document.getElementById(`입경크기분포-scatter-chart-wrapper`),
      { backgroundColor: '#fff', useCORS: true, scale: 1.5 }
    );
    const link = document.createElement('a');
    link.download = `입경크기분포-scatterChart.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <>
      {/* 데이터 검색 조건 설정 */}
      <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
        <SearchDate setDateList={setDateList} type="intensive" />
        <SearchStation
          title="대기환경연구소"
          siteType="intensive"
          onTms={false}
          setStationList={setStationList}
        />
        <SearchPollutant
          title="자료획득률"
          signList={signList}
          initialPollutant={pollutant}
          setPollutant={setPollutant}
        />
        <SearchCond
          condList={condList}
          initialSearchCond={searchCond}
          setSearchCond={setSearchCond}
        />
      </SearchFrame>

      {/* 결과 테이블 */}
      <ContentTableFrame
        datas={contentData}
        isLoading={isLoading}
        fileName="(단일)입경크기분포"
      />

      {/* 그래프 검색 조건 설정 */}
      <FlexColWrapper className="w-full p-6 gap-2 border-2 border-gray-300 items-baseline">
        <FlexRowWrapper className="w-full justify-start items-stretch gap-2">
          <Select
            className="w-fit min-w-40"
            onChange={e =>
              setOptions(prev => ({ ...prev, groupdate: e.target.value }))
            }
          >
            {optionSettings.groupdate.map(date => (
              <Option key={date} value={date}>
                {date}
              </Option>
            ))}
          </Select>
          <CustomMultiSelect
            className="w-100"
            options={optionSettings.groupNm}
            setOutsideSelectedOptions={setSelectedGroupNms}
          />
          <Select
            className="w-fit min-w-40"
            onChange={e =>
              setOptions(prev => ({ ...prev, type: e.target.value }))
            }
          >
            {optionSettings.type.map(type => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
          <Button
            className="w-fit px-5 bg-blue-900 text-white"
            onClick={handleClickDrawChart}
          >
            그래프 그리기
          </Button>
        </FlexRowWrapper>

        {/* 그래프 그리기 */}
        {chartSettings && (
          <>
            <div
              id={`입경크기분포-scatter-chart-wrapper`}
              className="w-full h-full p-2"
            >
              <ScatterChart chartSettings={chartSettings} />
            </div>
            <FlexRowWrapper className="w-full justify-end">
              <Button
                onClick={handleSaveImage}
                className="w-fit px-4 bg-blue-900 text-white"
              >
                이미지 저장
              </Button>
            </FlexRowWrapper>
          </>
        )}
      </FlexColWrapper>
    </>
  );
};

export { IntensivePsize };

const signList = [
  { id: 'High', text: '~75% 미만', checked: true, signvalue: '#' },
  { id: 'Low', text: '~50% 미만', checked: true, signvalue: '##' },
];
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

const typeUnits = {
  'dN/dlogdP': '#/cm3',
  'dS/dlogdP': 'um3/cm3',
  'dV/dlogdP': 'ug/cm3',
  'dM/dlogdP': 'm2#/cm3',
};
