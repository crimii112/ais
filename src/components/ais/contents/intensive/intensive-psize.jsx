import { useCallback, useMemo, useState, useEffect } from 'react';
import usePostRequest from '@/hooks/usePostRequest';

import { SearchFrame } from '../../search-frame';
import { SearchDate } from '../../search-date';
import { SearchStation } from '../../search-station';
import { SearchPollutant } from '../../search-pollutant';
import { SearchCond } from '../../search-cond';
import { ContentTableFrame } from '../../content-table-frame';
import { FlexRowWrapper, Button } from '@/components/ui/common';
import CustomMultiSelect from '@/components/ui/custom-multiple-select';
import { ContentScatterChartFrame } from '../../content-scatter-chart-frame';
import { SelectWithArrows } from '@/components/ui/select-box';

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

  const [shouldRedrawChart, setShouldRedrawChart] = useState(false);

  const apiData = useMemo(
    () => ({
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

      // 그래프 설정 옵션 설정
      const groupdate = [
        ...new Set(apiRes.rstList.map(item => item.groupdate)),
      ];
      const groupdateOptions = groupdate.map(item => {
        return {
          value: item,
          text: item,
        };
      });
      const type = [...new Set(apiRes.rstList.map(item => item.type))];
      const typeOptions = type.map(item => {
        return {
          value: item,
          text: item,
        };
      });
      const groupNm = apiRes.rstList2.map(item => ({
        value: item.groupNm,
        text: item.groupNm,
      }));

      setOptions({
        groupdate: groupdate[0],
        type: type[0],
        groupNm: groupNm[0],
      });

      setOptionSettings({
        groupdate: groupdateOptions,
        type: typeOptions,
        groupNm,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiData, postMutation]);

  const setSelectedGroupNms = selectedOptions => {
    setOptions(prev => ({ ...prev, groupNm: selectedOptions }));
  };

  // 툴팁 커스텀
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

  // Select Box 옵션 이동(up/down) 핸들러
  const handleOptionNavigation = (optionName, direction) => {

    if(optionSettings[optionName].length === 0) return;

    const currentOptions = optionSettings[optionName];
    const currentValue = options[optionName];
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
    setOptions(prev => ({ ...prev, [optionName]: newOption.value }));
    setShouldRedrawChart(true);
  };

  // options 상태가 변경되고 shouldRedrawChart가 true일 때만 차트를 다시 그립니다
  useEffect(() => {
    if (shouldRedrawChart && Object.keys(options).length > 0) {
      handleClickDrawChart();
      setShouldRedrawChart(false);
    }
  }, [options, shouldRedrawChart]);

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

      {/* 그래프 그리기 */}
      <ContentScatterChartFrame
        isLoading={isLoading}
        title="입경크기분포"
        chartSettings={chartSettings}
      >
        <FlexRowWrapper className="w-full gap-10 mb-4 items-center justify-between">
          <div className="text-lg font-semibold text-gray-900 whitespace-nowrap p-1">
            그래프 설정
          </div>
          <FlexRowWrapper className="w-full items-stretch justify-start gap-3">
            <span className="flex flex-col items-center justify-center">
              측정일자 :{' '}
            </span>
            <SelectWithArrows
              id="groupdate"
              value={options.groupdate}
              options={optionSettings.groupdate}
              onChange={e =>
                setOptions(prev => ({ ...prev, groupdate: e.target.value }))
              }
              onNavigate={direction =>
                handleOptionNavigation('groupdate', direction)
              }
            />
            <span className="flex flex-col items-center justify-center">
              TYPE :{' '}
            </span>
            <SelectWithArrows
              id="type"
              value={options.type}
              options={optionSettings.type}
              onChange={e =>
                setOptions(prev => ({ ...prev, type: e.target.value }))
              }
              onNavigate={direction =>
                handleOptionNavigation('type', direction)
              }
            />
            <span className="flex flex-col items-center justify-center">
              측정소 :{' '}
            </span>
            <CustomMultiSelect
              className="w-100"
              options={optionSettings?.groupNm}
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
