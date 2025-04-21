import { useEffect, useCallback, useMemo, useState } from 'react';
import usePostRequest from '@/hooks/usePostRequest';

import { SearchFrame } from '../../search-frame';
import { SearchDate } from '../../search-date';
import { SearchStation } from '../../search-station';
import { SearchPollutant } from '../../search-pollutant';
import { SearchCond } from '../../search-cond';
import { ContentTableFrame } from '../../content-table-frame';
import { ContentScatterChartFrame } from '../../content-scatter-chart-frame';
import { FlexRowWrapper, Button } from '@/components/ui/common';
import CustomMultiSelect from '@/components/ui/custom-multiple-select';
import { SelectWithArrows } from '@/components/ui/select-box';

const IntensiveAuto = ({ type }) => {
  const config = INTENSIVE_AUTO_SETTINGS[type];
  const postMutation = usePostRequest();

  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [searchCond, setSearchCond] = useState([
    config.initCond, // condList
    { id: 'unit1', checked: false }, // markList
    { id: 'unit2', checked: false },
  ]);
  const [pollutant, setPollutant] = useState([
    { pm: 1, lon: 3, carbon: 1, metal: 1, gas: 1, other: 6 }, // digitList
    { id: 'High', checked: true, signvalue: '#' }, // signList
    { id: 'Low', checked: true, signvalue: '##' },
    { id: 'dumy', checked: false },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  const [chartOptionSettings, setChartOptionSettings] = useState({
    pollutant: [],
    groupNm: [],
  });
  const [chartSelectedOption, setChartSelectedOption] = useState({});
  const [chartSettings, setChartSettings] = useState();
  const [shouldRedrawChart, setShouldRedrawChart] = useState(false);

  const apiData = useMemo(
    () => ({
      page: 'intensive/autotimecorrelation',
      date: dateList,
      site: stationList,
      cond: searchCond[0],
      mark: searchCond.slice(1),
      digitlist: pollutant[0],
      polllist: pollutant.slice(1),
    }),
    [dateList, stationList, searchCond, pollutant]
  );

  const handleClickSearchBtn = useCallback(async () => {
    if (!dateList.length) return alert('기간을 설정하여 주십시오.');
    if (!stationList.length) return alert('측정소를 설정하여 주십시오.');
    if (postMutation.isLoading) return;

    setChartSettings(undefined);
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

      // headList 중 물질만 추출하여 옵션 설정
      // 물질 옵션은 3번째 인덱스부터 시작
      const options = apiRes.headList.map((value, idx) => ({
        value,
        text: apiRes.headNameList[idx],
      }));
      const processedOptions = options.slice(3);

      const groupNm = apiRes.rstList2.map(item => ({
        value: item.groupNm,
        text: item.groupNm,
      }));

      setChartOptionSettings({ pollutant: processedOptions, groupNm });
      setChartSelectedOption({
        x: processedOptions[0],
        y: processedOptions[0],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiData, postMutation]);

  // 그래프(산점도) 선택 옵션(측정소명) 변경 핸들러
  const setSelectedGroupNms = selectedOptions => {
    setChartSelectedOption(prev => ({ ...prev, groupNm: selectedOptions }));
  };

  // 그래프(산점도) 선택 옵션(x, y축) 변경 핸들러
  const handleChangeChartSelectedOption = e => {
    const selectedOption = chartOptionSettings.pollutant.find(
      option => option.value === e.target.value
    );
    setChartSelectedOption(prev => ({
      ...prev,
      [e.target.id]: selectedOption,
    }));
  };

  // Select Box 옵션 이동(up/down) 핸들러
  const handleOptionNavigation = (axis, direction) => {

    if (chartOptionSettings.pollutant.length === 0) return;
    
    const currentOptions = chartOptionSettings.pollutant;
    const currentValue = chartSelectedOption[axis]?.value;
    const currentIndex = currentOptions.findIndex(
      option => option.value === currentValue
    );

    let newIndex;
    if (direction === 'up') {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : currentOptions.length - 1;
    } else {
      newIndex =
        currentIndex < currentOptions.length - 1 ? currentIndex + 1 : 0;
    }

    const newOption = currentOptions[newIndex];
    setChartSelectedOption(prev => ({ ...prev, [axis]: newOption }));
    setShouldRedrawChart(true);
  };

  // options 상태가 변경되고 shouldRedrawChart가 true일 때만 차트를 다시 그립니다
  useEffect(() => {
    if (shouldRedrawChart && Object.keys(chartSelectedOption).length > 0) {
      handleClickDrawChart();
      setShouldRedrawChart(false);
    }
  }, [chartSelectedOption, shouldRedrawChart]);

  // 툴팁 커스텀
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { groupdate, groupNm, x, y } = payload[0].payload;
      const xLabel = payload[0].name;
      const yLabel = payload[1].name;
      return (
        <div className="bg-white p-2.5 border-1 border-gray-300 rounded-md">
          <p className="font-semibold pb-1">
            {groupdate} - {groupNm}
          </p>
          <p>{`${xLabel} : ${x}`}</p>
          <p>{`${yLabel} : ${y}`}</p>
        </div>
      );
    }
    return null;
  };

  // 그래프(산점도) 그리기 버튼 클릭 핸들러
  const handleClickDrawChart = () => {
    const rawData = contentData.rstList.filter(data =>
      chartSelectedOption.groupNm?.some(item => item.value === data.groupNm)
    );

    if (!rawData.length)
      return alert('그래프를 그릴 데이터가 없습니다. 조건을 확인해주세요.');

    const processedData = rawData.map(item => ({
      groupdate: item.groupdate,
      groupNm: item.groupNm,
      x: parseFloat(item[chartSelectedOption.x.value]),
      y: parseFloat(item[chartSelectedOption.y.value]),
    }));

    const groupedData = processedData.reduce((acc, curr) => {
      acc[curr.groupNm] = acc[curr.groupNm] || [];
      acc[curr.groupNm].push(curr);
      return acc;
    }, {});

    setChartSettings({
      xAxis: {
        dataKey: 'x',
        scale: 'auto',
        domain: [0, 'auto'],
        ticks: [],
        label: chartSelectedOption.x.text,
      },
      yAxis: {
        dataKey: 'y',
        label: chartSelectedOption.y.text,
      },
      data: groupedData,
      tooltip: CustomTooltip,
    });
  };

  return (
    <>
      <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
        <SearchDate setDateList={setDateList} type="intensive" />
        <SearchStation
          title="대기환경연구소"
          siteType="intensive"
          onTms={false}
          setStationList={setStationList}
        />
        <SearchPollutant
          title="물질 및 소수점 자릿수"
          digitList={digitList}
          signList={signList}
          initialPollutant={pollutant}
          setPollutant={setPollutant}
        />
        <SearchCond
          condList={config.condList}
          markList={markList}
          initialSearchCond={searchCond}
          setSearchCond={setSearchCond}
        />
      </SearchFrame>

      <ContentTableFrame
        datas={contentData}
        isLoading={isLoading}
        fileName={config.title}
      />

      <ContentScatterChartFrame
        isLoading={isLoading}
        title={config.title}
        chartSettings={chartSettings}
      >
        <FlexRowWrapper className="w-full gap-10 mb-4 items-stretch justify-between">
          <div className="mt-1.5 text-lg font-semibold text-gray-900 whitespace-nowrap p-1">
            그래프 설정
          </div>
          <FlexRowWrapper className="w-full items-stretch justify-start gap-3">
            <span className="flex flex-col items-center justify-center">
              X :{' '}
            </span>
            <SelectWithArrows
              id="x"
              value={chartSelectedOption.x?.value}
              options={chartOptionSettings.pollutant}
              onChange={handleChangeChartSelectedOption}
              onNavigate={direction => handleOptionNavigation('x', direction)}
            />
            <span className="flex flex-col items-center justify-center">
              Y :{' '}
            </span>
            <SelectWithArrows
              id="y"
              value={chartSelectedOption.y?.value}
              options={chartOptionSettings.pollutant}
              onChange={handleChangeChartSelectedOption}
              onNavigate={direction => handleOptionNavigation('y', direction)}
            />
            <span className="flex flex-col items-center justify-center">
              측정소 :{' '}
            </span>
            <CustomMultiSelect
              className="w-100"
              options={chartOptionSettings.groupNm}
              setOutsideSelectedOptions={setSelectedGroupNms}
            />
          </FlexRowWrapper>
          <Button
            className="w-fit px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
            onClick={handleClickDrawChart}
          >
            그래프 그리기
          </Button>
        </FlexRowWrapper>
      </ContentScatterChartFrame>
    </>
  );
};

export { IntensiveAuto };

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
const graphCondList = [
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

const INTENSIVE_AUTO_SETTINGS = {
  timeCorrelation: {
    page: 'intensive/autotimecorrelation',
    chartType: 'scatter',
    initCond: {
      sect: 'time',
      poll: 'calc',
      dust: 'include',
      stats: '',
      eqType: 'SMPS_APS_O',
    },
    condList: condList,
    title: '자동-(단일)성분상관성검토',
  },
  graph: {
    page: 'intensive/autograph',
    chartType: 'bar',
    initCond: {
      sect: 'time',
      poll: 'calc',
      dust: 'include',
      stats: '',
      eqType: 'SMPS_APS_O',
    },
    condList: graphCondList,
    title: '자동-(단일)성분누적그래프',
  },
};
