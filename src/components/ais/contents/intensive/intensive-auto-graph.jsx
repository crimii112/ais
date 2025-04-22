import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { FlexColWrapper, FlexRowWrapper, Button } from '@/components/ui/common';
import { IntensiveDataFrame } from './intensive-data-frame';
import { ContentScatterChartFrame } from '../../content-scatter-chart-frame';
import { SelectWithArrows } from '@/components/ui/select-box';
import CustomMultiSelect from '@/components/ui/custom-multiple-select';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Loading } from '@/components/ui/loading';

const IntensiveAutoGraph = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chartDatas, setChartDatas] = useState();

  const initSettings = () => setChartDatas(null);

  const handleDataLoaded = data => {

    if(data.rstList[0] === 'NO DATA') return;

    {/* 성분별(기간별-STACKED) 그래프 데이터 */}
    const data1 = data.rstList.map(item => ({
      groupdate: item.groupdate, 
      groupNm: item.groupNm, 
      pm25: item.pm25 ? parseFloat(item.pm25) : null,
      ...selectedPollutant.bar.reduce((acc, pollutant) => ({
        ...acc,
        [pollutant.value]: item[pollutant.value] ? parseFloat(item[pollutant.value]) : null
      }), {})
    }));

    {/* PM2.5/PM10비율(기간별) 그래프 데이터 */}
    const data2 = data.rstList.map(item => ({
      groupdate: item.groupdate,
      groupNm: item.groupNm,
      pm10: item.pm10 ? parseFloat(item.pm10) : null,
      pm25: item.pm25 ? parseFloat(item.pm25) : null,
      pmrate: item.pmrate ? parseFloat(item.pmrate) : null,
    }));

    {/* AM-SUL, AM-NIT(기간별) 그래프 데이터 */}
    const data3 = data.rstList.map(item => ({
      groupdate: item.groupdate,
      groupNm: item.groupNm,
      amSul: item.amSul ? parseFloat(item.amSul) : null,
      amNit: item.amNit ? parseFloat(item.amNit) : null,
    }));

    setChartDatas({type1: data1, type2: data2, type3: data3});
  };

  {/* PM2.5/PM10비율(기간별) 그래프 - 데이터 크기별 BarSize 설정 */}
  const getBarSize = (dataLength) => {
    if(dataLength < 20) return {barSize: 40, barGap: -40 };
    else if(dataLength < 50) return {barSize: 20, barGap: -20 };
    else if(dataLength < 100) return {barSize: 15, barGap: -15 };
    else if(dataLength < 550) return {barSize: 2, barGap: -2 };
    else return {barSize: 1, barGap: -1 };
  }

  const type2BarSize = useMemo(() => { 
    return chartDatas?.type2 
      ? getBarSize(chartDatas.type2.length) 
      : {barSize: 40, barGap: -40, barCategoryGap:'1%'};
  }, [chartDatas?.type2]);

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const groupDate = payload[0].payload.groupdate;
      const groupNm = payload[0].payload.groupNm;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow">
          <p className="font-medium">{groupDate} - {groupNm}</p>
          {payload.map((entry, index) => {
            const poll = pollutants.find(item => item.value === entry.name);
            if(!poll) return null;

            return(
              <p key={index} style={{ color: entry.color }}>
                {poll?.text}: {entry.value === null ? '-' : entry.value}
              </p>
            )})}
        </div>
      );
    }
    return null;
  };

  return (
    <IntensiveDataFrame 
      type='autoGraph'
      onDataLoaded={handleDataLoaded}
      onLoadingChange={setIsLoading}
      initSettings={initSettings}
    >
      <FlexColWrapper className="w-full p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      {isLoading ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <Loading />
        </div>
      ) : 
        chartDatas && 
        <FlexColWrapper className='w-full h-full gap-6'>
          {/* 성분별(기간별-STACKED) 그래프 */}
          <div className='w-full h-full'>
            <div className="text-lg font-bold">성분별(기간별-STACKED)</div>
            <div className="w-full border-t border-gray-200" />
            <div
              id={`성분누적그래프-chart-wrapper`}
              className="w-full h-full py-6"
            >
              <ResponsiveContainer width="100%" height={700}>
                <ComposedChart margin={{ top: 20, right: 60, bottom: 30, left: 20 }} data={chartDatas.type1} barGap={0}>
                  <CartesianGrid strokeDasharray="3" vertical={false} />
                  <XAxis 
                    dataKey='groupdate' 
                    tick={{ fontSize: 12 }} 
                    label={{
                      value: '측정일자',
                      position: 'bottom',
                      fontWeight: 'bold',
                    }} 
                  />
                  <YAxis 
                    type='number' 
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Conc.(ug/m3)',
                      position: 'insideLeft',
                      fontWeight: 'bold',
                      angle: -90
                    }}
                  />
                  {selectedPollutant.bar.map((pollutant, idx) => (
                    <Bar key={pollutant.value} dataKey={pollutant.value} fill={COLORS[idx]} stackId='stackgroup' />
                  ))}
                  {selectedPollutant.line.map(pollutant => (
                    <Line key={pollutant.value} dataKey={pollutant.value} stroke='red' strokeWidth={2} />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <FlexRowWrapper className="w-full justify-end gap-2">
              <Button
                // onClick={handleSaveImage}
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
              >
                이미지 저장
              </Button>
            </FlexRowWrapper>
          </div>

          {/* PM2.5/PM10비율(기간별) 그래프 */}
          <div className='w-full h-full'>
            <div className="text-lg font-bold">PM2.5/PM10비율(기간별)</div>
            <div className="w-full border-t border-gray-200" />
            <div
              id={`성분누적그래프-chart-wrapper`}
              className="w-full h-full py-6"
            >
              <ResponsiveContainer width="100%" height={700}>
                <ComposedChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }} data={chartDatas.type2} barGap={type2BarSize.barGap} >
                  <CartesianGrid strokeDasharray="3" vertical={false} />
                  <XAxis 
                    dataKey='groupdate' 
                    allowDuplicatedCategory={false}
                    tick={{ fontSize: 12 }} 
                    label={{
                      value: '측정일자',
                      position: 'bottom',
                      fontWeight: 'bold',
                    }} 
                  />
                  <YAxis 
                    yAxisId='poll'
                    type='number' 
                    allowDuplicatedCategory={false}
                    tick={{ fontSize: 12 }}
                    tickCount={11}
                    label={{
                      value: 'Conc.(ug/m3)',
                      position: 'insideLeft',
                      fontWeight: 'bold',
                      angle: -90
                    }}
                  />
                  <YAxis
                    yAxisId='pmrate'
                    type='number' 
                    tick={{ fontSize: 12 }}
                    tickCount={11}
                    orientation='right'
                    label={{
                      value: 'PM2.5/PM10',
                      position: 'insideRight',
                      fontWeight: 'bold',
                      angle: -90
                    }}
                    domain={[0, 1]}
                  />
                  <Bar yAxisId='poll' dataKey='pm10' fill={COLORS[0]} barSize={type2BarSize.barSize} />
                  <Bar yAxisId='poll' dataKey='pm25' fill={COLORS[1]} barSize={type2BarSize.barSize} />
                  <Line yAxisId='pmrate' key='pmrate' dataKey='pmrate' stroke='red' strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <FlexRowWrapper className="w-full justify-end gap-2">
              <Button
                // onClick={handleSaveImage}
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
              >
                이미지 저장
              </Button>
            </FlexRowWrapper>
          </div>

          {/* AM-SUL, AM-NIT(기간별) 그래프 */}
          <div className='w-full h-full'>
            <div className="text-lg font-bold">AM-SUL, AM-NIT(기간별)</div>
            <div className="w-full border-t border-gray-200" />
            <div
              id={`성분누적그래프-chart-wrapper`}
              className="w-full h-full py-6"
            >
              <ResponsiveContainer width="100%" height={700}>
                <ComposedChart margin={{ top: 20, right: 60, bottom: 30, left: 20 }} data={chartDatas.type3} barGap={0} stackOffset='expand'>
                  <CartesianGrid strokeDasharray="3" vertical={false} />
                  <XAxis 
                    dataKey='groupdate' 
                    allowDuplicatedCategory={false}
                    tick={{ fontSize: 12 }} 
                    label={{
                      value: '측정일자',
                      position: 'bottom',
                      fontWeight: 'bold',
                    }} 
                  />
                  <YAxis 
                    type='number' 
                    tick={{ fontSize: 12 }}
                    tickCount={11}
                    tickFormatter={(value) => value *  100}
                    label={{
                      value: 'percent(%)',
                      position: 'insideLeft',
                      fontWeight: 'bold',
                      angle: -90
                    }}
                  />
                  <Bar key='amNit' dataKey='amNit' fill={COLORS[1]} stackId='stackgroup' />
                  <Bar key='amSul' dataKey='amSul' fill={COLORS[0]} stackId='stackgroup' />
                  <Tooltip content={<CustomTooltip />} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <FlexRowWrapper className="w-full justify-end gap-2">
              <Button
                // onClick={handleSaveImage}
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
              >
                이미지 저장
              </Button>
            </FlexRowWrapper>
          </div>

        </FlexColWrapper>
      }
    </FlexColWrapper>
      
    </IntensiveDataFrame>
  );
};

export { IntensiveAutoGraph };

// 성분별(기간별-STACKED): 막대 그래프 물질 고정
const selectedPollutant = {
  line: [
    {value: 'pm25', text: 'PM2.5'},
  ],
  bar: [
    {value: 'amSul', text: 'AM_SUL'}, 
    {value: 'amNit', text: 'AM_NIT'}, 
    {value: 'om', text: 'OM'}, 
    {value: 'ec', text: 'EC'}, 
    {value: 'cm', text: 'CM'}, 
    {value: 'tm', text: 'TM'}, 
    {value: 'etc', text: 'ETC'}
  ]
};

const pollutants = [
  {value: 'pm25', text: 'PM2.5'},
  {value: 'pm10', text: 'PM10'},
  {value: 'pmrate', text: 'PM2.5/PM10'},
  {value: 'amSul', text: 'AM_SUL'}, 
  {value: 'amNit', text: 'AM_NIT'}, 
  {value: 'om', text: 'OM'}, 
  {value: 'ec', text: 'EC'}, 
  {value: 'cm', text: 'CM'}, 
  {value: 'tm', text: 'TM'}, 
  {value: 'etc', text: 'ETC'}
]

const COLORS = [
  '#0088FE',
  '#FFBB28',
  '#00C49F',
  '#FF8042',
  '#003f5c',
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
