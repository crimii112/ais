import { useState } from 'react';
import usePostRequest from '@/hooks/usePostRequest';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { FlexRowWrapper, Button, Select, Option } from '@/components/ui/common';
import { ContentTableFrame } from '../content-table-frame';

const Test = () => {
  const postMutation = usePostRequest();

  const [apiData, setApiData] = useState();
  const [contentData, setContentData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [optionSettings, setOptionSettings] = useState();
  const [options, setOptions] = useState({});
  const [chartData, setChartData] = useState();

  const handleClickSearchBtn = async () => {
    const apiData = {
      page: 'intensive/psize',
      date: ['DATARF;2015/01/01 01;2015/01/05 24'],
      site: [823001, 111001],
      cond: {
        sect: 'time',
        poll: 'calc',
        dust: 'include',
        stats: '',
        eqType: 'SMPS_APS_O',
      },
      mark: [
        { id: 'unit1', checked: false },
        { id: 'unit2', checked: false },
      ],
      digitlist: { pm: 1, lon: 3, carbon: 1, metal: 1, gas: 1, other: 6 },
      polllist: [
        { id: 'High', checked: true, signvalue: '#' },
        { id: 'Low', checked: true, signvalue: '##' },
        { id: 'dumy', checked: false },
      ],
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

      setApiData(apiData);
      console.log(apiData);
      console.log(apiRes);

      const groupdate = [
        ...new Set(apiRes.rstList.map(item => item.groupdate)),
      ];
      const type = [...new Set(apiRes.rstList.map(item => item.type))];
      const groupNm = apiRes.rstList2.map(item => item.groupNm);

      setOptions({
        groupdate: groupdate[0],
        type: type[0],
        groupNm: groupNm[0],
      });
      setOptionSettings({ groupdate: groupdate, type: type, groupNm: groupNm });
      setContentData(apiRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickDrawChart = () => {
    console.log(options);

    const rawData = contentData.rstList.filter(data => {
      if (
        data.groupdate === options.groupdate &&
        data.groupNm === options.groupNm &&
        data.type === options.type
      ) {
        return data;
      }
    });

    const { groupdate, groupNm, type, ...dataPoints } = rawData[0];

    const processedData = Object.entries(dataPoints)
      .filter(([key, _]) => !isNaN(key))
      .map(([key, value]) => ({
        groupdate,
        groupNm,
        type,
        x: Number(key) / 10,
        y: parseFloat(value),
      }));

    console.log(processedData);
    setChartData(processedData);
  };

  return (
    <>
      {apiData && <div>{JSON.stringify(apiData)}</div>}
      <Button onClick={handleClickSearchBtn}>검색</Button>
      <ContentTableFrame
        datas={contentData}
        isLoading={isLoading}
        fileName="test"
      />

      {optionSettings && (
        <FlexRowWrapper className="w-full justify-start">
          <Select
            className="w-fit"
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
          <Select
            className="w-fit"
            onChange={e =>
              setOptions(prev => ({ ...prev, groupNm: e.target.value }))
            }
          >
            {optionSettings.groupNm.map(name => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
          <Select
            className="w-fit"
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
          <Button className="w-fit" onClick={handleClickDrawChart}>
            그래프 그리기
          </Button>
        </FlexRowWrapper>
      )}
      {chartData && (
        <ResponsiveContainer width="100%" height={700}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3" vertical={false} />
            <XAxis
              type="number"
              dataKey="x"
              scale="log"
              domain={[10.6, 10000]}
              ticks={[10, 100, 1000, 10000]}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              label={{
                value: chartData[0].type + '(' + units[chartData[0].type] + ')',
                angle: -90,
                position: 'insideLeft',
              }}
              tick={{ fontSize: 12 }}
            />
            <Scatter data={chartData} fill={COLORS[0]} />
            <Tooltip />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </>
  );
};
export { Test };

const units = {
  'dN/dlogdP': '#/cm3',
  'dS/dlogdP': 'um3/cm3',
  'dV/dlogdP': 'ug/cm3',
  'dM/dlogdP': 'm2#/cm3',
};

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#a05195',
  '#1f77b4',
  '#d45087',
  '#2ca02c',
  '#17becf',
  '#f95d6a',
  '#9467bd',
  '#ff7c43',
  '#003f88',
  '#d62728',
  '#ffa600',
  '#8c564b',
  '#ff5733',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#b10026',
  '#666666',
  '#6a3d9a',
  '#e31a1c',
  '#b15928',
  '#1b9e77',
  '#084081',
  '#fc4e2a',
  '#7570b3',
  '#fd8d3c',
  '#0868ac',
  '#e7298a',
  '#feb24c',
  '#66a61e',
  '#fed976',
  '#2b8cbe',
  '#d95f02',
  '#e6ab02',
  '#4eb3d3',
];
