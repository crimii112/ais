import { useCallback, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { IntensiveDataFrame } from "./intensive-data-frame";
import { Button, FlexColWrapper, FlexRowWrapper, Input } from "@/components/ui/common";
import CustomMultiSelect from "@/components/ui/custom-multiple-select";
import { Loading } from "@/components/ui/loading";
import { Select, Option } from "@/components/ui/select-box";

/**
 * 기상자료 검색 컴포넌트
 * @param {string} type - 기상자료 검색 타입
 * @returns {React.ReactNode} 기상자료 검색 컴포넌트
 */
const IntensiveWeather = ({ type }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contentData, setContentData] = useState(null);

    const [chartOptionList, setChartOptionList] = useState({pollutantList: [], groupNmList: []});
    
    const [selectedGroupNm, setSelectedGroupNm] = useState(''); //(단일)풍향,풍속그래프 페이지에서 사용

    const [chartConfig, setChartConfig] = useState(null);
    const [axisSettings, setAxisSettings] = useState([
        { label: 'Y-Left1', orientation: 'left', isAuto: true, min: 0, max: 100, selectedOptions: [] },
        { label: 'Y-Left2', orientation: 'left', isAuto: true, min: 0, max: 100, selectedOptions: [] },
        { label: 'Y-Right1', orientation: 'right', isAuto: true, min: 0, max: 100, selectedOptions: [] },
        { label: 'Y-Right2', orientation: 'right', isAuto: true, min: 0, max: 100, selectedOptions: [] },
    ]);

    const [highlightedRow, setHighlightedRow] = useState(null);

    const colorMapRef = useRef({}); // 여기에 색상 저장
    const colorIndexRef = useRef(0);

    const initSettings = () => {
        setChartConfig(null);
    }

    // 데이터 로드 시 데이터 가공
    const handleDataLoaded = useCallback(data => {
        if (!data?.headList || !data?.headNameList || !data?.rstList2) return;
        if(data.rstList[0] === 'NO DATA') return;
        
        setContentData(data);

        // option value, text 설정
        const options = data.headList.map((value, idx) => ({
            value,
            text: data.headNameList[idx],
        }));
        const flagIndex = options.findIndex(option => option.value === 'mlh') + 1;
        setChartOptionList({pollutantList: options.slice(3, flagIndex)});

        if(type === 'wswdGraph') {
            // 측정소명 리스트 설정
            const groupNms = data.rstList2.map(el => ({value:el.groupNm, text:el.groupNm}));
            setChartOptionList(prev => ({...prev, groupNmList: groupNms}));
            setSelectedGroupNm(groupNms[0].value);
        }
        
    }, []);

    // 축 설정 업데이트
    const updateAxisSettings = (idx, updates) => {  
        setAxisSettings(prev =>
            prev.map((axis, i) => (i === idx ? { ...axis, ...updates } : axis))
        );
    };

    // 측정소 선택 업데이트
    const updateSelectedGroupNm = e => {
        setSelectedGroupNm(e.target.value);
    }
    
    // 그래프 그리기 버튼 클릭 이벤트
    const handleClickDrawChart = () => {
        let filteredData = [];

        if(type === 'weatherRvwr') {
            filteredData = contentData.rstList;
        } else if(type === 'wswdGraph') {
            filteredData = contentData.rstList.filter(item => item.groupNm === selectedGroupNm);
        }

        const datas = filteredData.map(res => {
            const newRes = { ...res };
                chartOptionList.pollutantList.forEach(option => {
                  const rawVal = newRes[option.value];
                  const parsed = parseFloat(rawVal);
                  newRes[option.value] =
                    rawVal !== undefined && rawVal !== '' && !isNaN(parsed)
                      ? parsed
                      : null;
                });
          
                return newRes;
        });

        setChartConfig({ datas, axisSettings, pollutantList: chartOptionList.pollutantList });
    };

    // Line 색상 지정
    const getNextColor = () => {
        const color = COLORS[colorIndexRef.current % COLORS.length];
        colorIndexRef.current += 1;
        return color;
    };
    const getColorByKey = key => {
        if (!colorMapRef.current[key]) {
        colorMapRef.current[key] = getNextColor();
        }
        return colorMapRef.current[key];
    };
    
    // Y축 물질에 따라 범위 설정
    const getYAxisDomain = (axis) => {
        if(axis.isAuto) {
            if(axis.selectedOptions.findIndex(option => option.value === "pressure") !== -1) {  // 기압
                return [0, 1050];
            } else if(axis.selectedOptions.findIndex(option => option.value === 'wd') !== -1) {  // 풍향
                return [0, 360];
            } else if(axis.selectedOptions.findIndex(option => option.value === 'hum') !== -1) {  // 습도
                return [0, 100];
            } else if(axis.selectedOptions.findIndex(option => option.value === 'cloud') !== -1) {  // CLOUD(10분위)
                return [0, 10];
            } else {
                return ['0', 'auto'];
            }
        }
        return [axis.min, axis.max];
    }

    // 그래프 클릭 시 rowKey 설정 => 테이블에서 해당하는 행에 하이라이트 표시할 용도
  const handleChartClick = useCallback((e) => {
    if (!e?.activePayload?.[0]?.payload) return;
    
    const clicked = e.activePayload[0].payload;
    const rowKey = `${clicked.yyyymmddhh}_${clicked.areaName}`;
    
    // 이전 값과 동일한 경우 업데이트 방지
    if (rowKey === highlightedRow) return;

    setHighlightedRow(rowKey);
  }, [highlightedRow]);

    return (
        <IntensiveDataFrame 
            type={type}
            onDataLoaded={handleDataLoaded}
            onLoadingChange={setIsLoading}
            initSettings={initSettings}
            highlightedRow={highlightedRow}     
        >
            {/** 그래프 설정 부분 공통으로 */}
            <FlexColWrapper className="w-full p-6 border border-gray-200 rounded-lg shadow-sm bg-white items-start">
                {isLoading ? (
                    <div className="w-full h-[400px] flex items-center justify-center">
                        <Loading />
                    </div>
                ) : (
                    <>
                        <FlexRowWrapper className="w-full gap-10 mb-4 items-start justify-between">
                            <div className="mt-1.5 text-lg font-semibold text-gray-900 whitespace-nowrap p-1">
                                그래프 설정
                            </div>
                            {type === 'weatherRvwr' && (
                                <FlexColWrapper className="w-full items-start justify-between gap-3">
                                    {axisSettings.map((axis, idx) => (
                                        <FlexRowWrapper key={axis.label} className="items-center gap-4">
                                            <div className="w-20 text-center">
                                                <span className="text-base font-medium text-gray-700">{axis.label}</span>
                                            </div>
                                                
                                            <div className="flex-1">
                                                <CustomMultiSelect
                                                    options={chartOptionList?.pollutantList}
                                                    setOutsideSelectedOptions={selected => updateAxisSettings(idx, {selectedOptions: selected})}
                                                />
                                            </div>
                                                
                                            <FlexRowWrapper className="items-center gap-3">
                                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Input
                                                        type="checkbox"
                                                        checked={axis.isAuto}
                                                        onChange={e => updateAxisSettings(idx, {isAuto: e.target.checked})}
                                                        className="w-4 h-4 rounded border-gray-300"
                                                    />
                                                    자동
                                                </label>
                                                    
                                                <Input
                                                    type="number"
                                                    value={axis.min}
                                                    onChange={e => updateAxisSettings(idx, {min: Number(e.target.value)})}
                                                    readOnly={axis.isAuto}
                                                    className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded read-only:bg-gray-50 text-center"
                                                />
                                                <span className="text-gray-400 pt-1.5">~</span>
                                                <Input
                                                    type="number"
                                                    value={axis.max}
                                                    onChange={e => updateAxisSettings(idx, {max: Number(e.target.value)})}
                                                    readOnly={axis.isAuto}
                                                    className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded read-only:bg-gray-50 text-center"
                                                />
                                            </FlexRowWrapper>
                                        </FlexRowWrapper>
                                    ))}
                                </FlexColWrapper>
                            )}
                            {type === 'wswdGraph' && (
                                <FlexRowWrapper className="w-full items-stretch justify-start gap-3 p-1">
                                    <span className="flex flex-col items-center justify-center">측정소 : </span>
                                    <Select className="w-40 p-2" value={selectedGroupNm} onChange={updateSelectedGroupNm}>
                                        {chartOptionList?.groupNmList?.map(item => (
                                            <Option key={item.value} value={item.value}>{item.text}</Option>
                                        ))}
                                    </Select>
                              </FlexRowWrapper>
                            )}
                            <FlexRowWrapper className="gap-2 mt-1.5">
                                <Button
                                    onClick={handleClickDrawChart}
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
                                >
                                    그래프 그리기
                                </Button>
                            </FlexRowWrapper>

                        </FlexRowWrapper>
                        {/** 그래프 그리기 버튼 클릭 시 결과 그래프(type에 따라 다름) */}
                        {chartConfig && type === 'weatherRvwr' && (
                            <ResponsiveContainer width="100%" height={700}>
                                <LineChart
                                    data={chartConfig.datas}
                                    margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
                                    onClick={handleChartClick}
                                >
                                    <Legend
                                        verticalAlign="bottom"
                                        wrapperStyle={{
                                            paddingTop: 40,
                                            border: 'none',
                                            outline: 'none',
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                    <Tooltip />
                                    <CartesianGrid strokeDasharray="3" vertical={false} />
                                    <XAxis
                                        dataKey="yyyymmddhh"
                                        allowDuplicatedCategory={false}
                                        label={{
                                            value: '측정일자',
                                            position: 'bottom',
                                            fontWeight: 'bold',
                                        }}
                                        tick={{ fontSize: 12 }}
                                    />
                                    {chartConfig.axisSettings.map( axis =>
                                        axis.selectedOptions.length !== 0 && (
                                            <YAxis
                                                key={axis.label}
                                                yAxisId={`${axis.label}`}
                                                orientation={`${axis.orientation}`}
                                                type="number"
                                                domain={getYAxisDomain(axis)}
                                                fontSize={12}
                                                label={{
                                                    value: axis.selectedOptions.map(option => ' ' + option.text),
                                                    angle: -90,
                                                    position: axis.orientation === 'left' ? 'insideLeft' : 'insideRight',
                                                    fontWeight: 'bold',
                                                    dx: axis.orientation === 'left' ? 10 : -10,
                                                    dy: axis.orientation === 'left' ? 50 : -50,
                                                }}
                                                allowDataOverflow={true}
                                                tickCount={11}
                                            />
                                        )
                                    )}
                                    {contentData.rstList2.map(el =>
                                        chartConfig.axisSettings.map(axis =>
                                            axis.selectedOptions.map(option => {
                                                const key = `${el.groupNm}-${option.text}`;

                                                return (
                                                    <Line
                                                        key={el.groupNm + ' - ' + option.text}
                                                        data={chartConfig.datas.filter(
                                                            data => data.areaName === el.groupNm
                                                        )}
                                                        yAxisId={axis.label}
                                                        dataKey={option.value}
                                                        name={`${el.groupNm} - ${option.text}`}
                                                        stroke={getColorByKey(key)}
                                                        connectNulls={false}
                                                        // activeDot={{ onClick: handleActiveDotClick }}
                                                    />
                                                );
                                            })
                                        )
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        )}

                        {chartConfig && type === 'wswdGraph' && (
                            <>
                            <div className='w-full h-full p-2'>
                                <div className="text-lg font-bold">풍향,풍속(기간별)</div>
                                <div className="w-full border-t border-gray-200" />
                                <div
                                    id={`풍향,풍속(기간별)-chart-wrapper`}
                                    className="w-full h-full py-6"
                                >
                                    <ResponsiveContainer width="100%" height={700}>
                                        <LineChart 
                                            data={chartConfig.datas} 
                                            margin={{ top: 20, right: 60, bottom: 30, left: 20 }} 
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
                                                yAxisId='wd'
                                                type='number' 
                                                tick={{ fontSize: 12 }}
                                                tickCount={11}
                                                domain={[0, 360]}
                                                label={{
                                                    value: 'WD(도)',
                                                    position: 'insideLeft',
                                                    fontWeight: 'bold',
                                                    angle: -90
                                                }}
                                            />
                                            <YAxis 
                                                yAxisId='ws'
                                                orientation='right'
                                                type='number' 
                                                tick={{ fontSize: 12 }}
                                                tickCount={11}
                                                label={{
                                                    value: 'WS(m/s)',
                                                    position: 'insideRight',
                                                    fontWeight: 'bold',
                                                    angle: -90
                                                }}
                                            />
                                            <Line yAxisId='wd' dataKey='wd' name="wd" stroke='none' dot={{r: 3, fill: 'white',stroke: '#0088FE'}}/>
                                            <Line yAxisId='ws' dataKey='ws' name="ws" stroke='#00C49F' />
                                            <Tooltip />
                                            <Legend 
                                                verticalAlign="bottom"
                                                wrapperStyle={{
                                                    paddingTop: 40,
                                                    border: 'none',
                                                    outline: 'none',
                                                    backgroundColor: 'transparent',
                                                }} 
                                            />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* <FlexRowWrapper className="w-full justify-end gap-2">
                                        <Button
                                            onClick={() => handleSaveImage('성분별(기간별-STACKED)')}
                                            className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
                                        >
                                            {isSavingImage ? '이미지 저장 중...' : '이미지 저장'}
                                        </Button>
                                    </FlexRowWrapper> */}
                                </div>
                            <div className='w-full h-full p-2'>
                                <div className="text-lg font-bold">목측시정,계산시정(기간별)</div>
                                <div className="w-full border-t border-gray-200" />
                                <div
                                    id={`목측시정,계산시정(기간별)-chart-wrapper`}
                                    className="w-full h-full py-6"
                                >
                                    <ResponsiveContainer width="100%" height={700}>
                                        <LineChart 
                                            data={chartConfig.datas} 
                                            margin={{ top: 20, right: 60, bottom: 30, left: 20 }} 
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
                                                yAxisId='visible'
                                                type='number' 
                                                tick={{ fontSize: 12 }}
                                                tickCount={11}
                                                domain={[0, 360]}
                                                label={{
                                                    value: 'VISIBLE(km)',
                                                    position: 'insideLeft',
                                                    fontWeight: 'bold',
                                                    angle: -90
                                                }}
                                            />
                                            <YAxis 
                                                yAxisId='si'
                                                orientation='right'
                                                type='number' 
                                                tick={{ fontSize: 12 }}
                                                tickCount={11}
                                                label={{
                                                    value: '광학시정(km)',
                                                    position: 'insideRight',
                                                    fontWeight: 'bold',
                                                    angle: -90
                                                }}
                                            />
                                            <Line yAxisId='visible' dataKey='visible' name="visible" stroke='#0088FE' />
                                            <Line yAxisId='si' dataKey='si' name="si" stroke='#00C49F' />
                                            <Tooltip />
                                            <Legend 
                                                verticalAlign="bottom"
                                                wrapperStyle={{
                                                    paddingTop: 40,
                                                    border: 'none',
                                                    outline: 'none',
                                                    backgroundColor: 'transparent',
                                                }} 
                                            />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* <FlexRowWrapper className="w-full justify-end gap-2">
                                        <Button
                                            onClick={() => handleSaveImage('성분별(기간별-STACKED)')}
                                            className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 font-medium"
                                        >
                                            {isSavingImage ? '이미지 저장 중...' : '이미지 저장'}
                                        </Button>
                                    </FlexRowWrapper> */}
                                </div>
                            </>
                            )}
                    </>
                )}
            </FlexColWrapper>
            

            

           
        </IntensiveDataFrame>
    )
}

export { IntensiveWeather };

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
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
  