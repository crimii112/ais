import React, { useCallback, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { FlexColWrapper, FlexRowWrapper, Button } from '@/components/ui/common';
import { IntensiveDataFrame } from './intensive-data-frame';
import { Loading } from '@/components/ui/loading';

/**
 * 자동-(단일)성분누적그래프 페이지
 * - 1. 성분별(기간별-STACKED), 2. PM2.5/PM10비율(기간별), 3. AM-SUL, AM-NIT(기간별)로 총 3가지 그래프 구현
 */
const IntensiveAutoGraph = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [chartDatas, setChartDatas] = useState();

  const [selectedRowKey, setSelectedRowKey] = useState();

  const initSettings = () => setChartDatas(null);

  const handleDataLoaded = data => {
    if(data.rstList[0] === 'NO DATA') return;

    const processedData = {
      // 성분별(기간별-STACKED) 그래프 데이터
      type1: data.rstList.map(item => ({
        groupdate: item.groupdate, 
        groupNm: item.groupNm, 
        pm25: item.pm25 ? parseFloat(item.pm25) : null,
        ...selectedPollutant.bar.reduce((acc, pollutant) => ({
          ...acc,
          [pollutant.value]: item[pollutant.value] ? parseFloat(item[pollutant.value]) : null
        }), {})
      })),
      // PM2.5/PM10비율(기간별) 그래프 데이터
      type2: data.rstList.map(item => ({
        groupdate: item.groupdate,
        groupNm: item.groupNm,
        pm10: item.pm10 ? parseFloat(item.pm10) : null,
        pm25: item.pm25 ? parseFloat(item.pm25) : null,
        pmrate: item.pmrate ? parseFloat(item.pmrate) : null,
      })),
      // AM-SUL, AM-NIT(기간별) 그래프 데이터
      type3: data.rstList.map(item => ({
        groupdate: item.groupdate,
        groupNm: item.groupNm,
        amSul: item.amSul ? parseFloat(item.amSul) : null,
        amNit: item.amNit ? parseFloat(item.amNit) : null,
      }))
    };

    setChartDatas(processedData);
  };

  // PM2.5/PM10비율(기간별) 그래프 데이터 크기에 따른 barSize, barGap 설정
  // recharts 라이브러리에 앞뒤로 겹치게 하는 기능이 없어서 barGap을 음수로 설정하여 겹치게 설정
  const getBarSize = useCallback((dataLength) => {
    if(dataLength < 20) return {barSize: 40, barGap: -40 };
    else if(dataLength < 50) return {barSize: 20, barGap: -20 };
    else if(dataLength < 100) return {barSize: 15, barGap: -15 };
    else if(dataLength < 550) return {barSize: 2, barGap: -2 };
    else return {barSize: 1, barGap: -1 };
  }, []);
  const type2BarSize = useMemo(() => { 
    return chartDatas?.type2 
      ? getBarSize(chartDatas.type2.length) 
      : {barSize: 40, barGap: -40, barCategoryGap:'1%'};
  }, [chartDatas?.type2, getBarSize]);

  // 성분별(기간별-STACKED) 그래프 커스텀 툴팁
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
            return (
              <p key={index} style={{ color: entry.color }}>
                {poll.text}: {entry.value === null ? '-' : entry.value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const Type3Tooltip = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow" style={{ visibility: 'visible', pointerEvents: 'auto' }}>
          <p className="font-medium">{data.groupdate} - {data.groupNm}</p>
          <p style={{ color: COLORS[0] }}>amNit(ug/m3): {data.amNit}</p>
          <p style={{ color: COLORS[1] }}>amSul(ug/m3): {data.amSul}</p>
        </div>
      );
    }
    return null;
  };

  // 이미지 저장 버튼 핸들러
  const handleSaveImage = async (title) => {
    try {
      setIsSavingImage(true);
      await document.fonts.ready;
      const canvas = await html2canvas(
        document.getElementById(`${title}-chart-wrapper`),
        { backgroundColor: '#fff', useCORS: true, scale: 1.5}
      );
      const link = document.createElement('a');
      link.download = `${title}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('이미지 저장 중 오류 발생:', error);
      alert('이미지 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSavingImage(false);
    }
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
        <FlexColWrapper className='w-full h-full gap-15'>
          {/* 성분별(기간별-STACKED) 그래프 */}
          <div className='w-full h-full'>
            <div className="text-lg font-bold">성분별(기간별-STACKED)</div>
            <div className="w-full border-t border-gray-200" />
            <div
              id={`성분별(기간별-STACKED)-chart-wrapper`}
              className="w-full h-full py-6"
            >
              <ResponsiveContainer width="100%" height={700}>
                <ComposedChart 
                  margin={{ top: 20, right: 60, bottom: 30, left: 20 }} 
                  data={chartDatas.type1} 
                  barGap={0} 
                  onClick={(e) => {
                    const clicked = e?.activePayload?.[0]?.payload;
                    console.log(clicked.groupdate + '_' + clicked.groupNm);
                    if(clicked) setSelectedRowKey(clicked.groupdate + '_' + clicked.groupNm);
                  }} 
                >
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
                    <Bar key={pollutant.value} dataKey={pollutant.value} fill={COLORS[idx]} stackId='stackgroup'  />
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
                onClick={() => handleSaveImage('성분별(기간별-STACKED)')}
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
              >
                {isSavingImage ? '이미지 저장 중...' : '이미지 저장'}
              </Button>
            </FlexRowWrapper>
          </div>


          {/* PM2.5/PM10비율(기간별) 그래프 */}
          <div className='w-full h-full'>
            <div className="text-lg font-bold">PM2.5/PM10비율(기간별)</div>
            <div className="w-full border-t border-gray-200" />
            <div
              id={`PM2.5/PM10비율(기간별)-chart-wrapper`}
              className="w-full h-full py-6"
            >
              <ResponsiveContainer width="100%" height={700}>
                <ComposedChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }} data={chartDatas.type2} barGap={type2BarSize.barGap}
                  onClick={(e) => {
                    const clicked = e?.activePayload?.[0]?.payload;
                    console.log(clicked.groupdate + '_' + clicked.groupNm);
                    if(clicked) setSelectedRowKey(clicked.groupdate + '_' + clicked.groupNm);
                  }}
                >
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
                  <Line yAxisId='pmrate' dataKey='pmrate' stroke='red' strokeWidth={2} />
                  <Bar yAxisId='poll' dataKey='pm10' fill={COLORS[0]} barSize={type2BarSize.barSize} />
                  <Bar yAxisId='poll' dataKey='pm25' fill={COLORS[1]} barSize={type2BarSize.barSize} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].payload) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded shadow">
                          <p className="font-medium">{data.groupdate} - {data.groupNm}</p>
                          <p style={{ color: 'red' }}>PM2.5/PM10: {data.pmrate}</p>
                          <p style={{ color: COLORS[0] }}>PM10: {data.pm10}</p>
                          <p style={{ color: COLORS[1] }}>PM2.5: {data.pm25}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <FlexRowWrapper className="w-full justify-end gap-2">
              <Button
                onClick={() => handleSaveImage('PM2.5/PM10비율(기간별)')}
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
              >
                {isSavingImage ? '이미지 저장 중...' : '이미지 저장'}
              </Button>
            </FlexRowWrapper>
          </div>


          {/* AM-SUL, AM-NIT(기간별) 그래프 */}
          <div className='w-full h-full'>
            <div className="text-lg font-bold">AM-SUL, AM-NIT(기간별)</div>
            <div className="w-full border-t border-gray-200" />
            <div
              id={`AM-SUL,AM-NIT(기간별)-chart-wrapper`}
              className="w-full h-full py-6"
            >
              <ResponsiveContainer width="100%" height={700}>
                <BarChart data={chartDatas.type3} margin={{ top: 20, right: 60, bottom: 30, left: 20 }} stackOffset='expand' barGap={0}  >
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
                    tickFormatter={(value) => value * 100 }
                    label={{
                      value: 'percent(%)',
                      angle: -90,
                      position: 'insideLeft',
                      fontWeight: 'bold',
                    }}
                  />
                  <Bar data={chartDatas.type3} key='amNit' dataKey='amNit' fill={COLORS[0]} stackId='stackgroup' />
                  <Bar data={chartDatas.type3} key='amSul' dataKey='amSul' fill={COLORS[1]} stackId='stackgroup' />
                  <Tooltip content={<Type3Tooltip />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <FlexRowWrapper className="w-full justify-end gap-2">
              <Button
                onClick={() => handleSaveImage('AM-SUL,AM-NIT(기간별)')}
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
              >
                {isSavingImage ? '이미지 저장 중...' : '이미지 저장'}
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
