import { useCallback, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { IntensiveDataFrame } from "./intensive-data-frame";
import { Button, FlexColWrapper, FlexRowWrapper, Input } from "@/components/ui/common";
import CustomMultiSelect from "@/components/ui/custom-multiple-select";
import { Loading } from "@/components/ui/loading";

const IntensiveWeather = ({ type }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contentData, setContentData] = useState(null);

    const [pollutantList, setPollutantList] = useState([]); //multiSelect Options
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

        const flagIndex = options.findIndex(option => option.value === 'flag');
        setPollutantList(options.slice(3, flagIndex));
    }, []);
    
    const updateAxisSettings = (idx, updates) => {
        setAxisSettings(prev =>
            prev.map((axis, i) => (i === idx ? { ...axis, ...updates } : axis))
        );
    };
    
    // 그래프 그리기 버튼 클릭 이벤트
    const handleClickDrawChart = () => {
        const datas = contentData.rstList.map(res => {
            const newRes = { ...res };
            pollutantList.forEach(option => {
              const rawVal = newRes[option.value];
              const parsed = parseFloat(rawVal);
              newRes[option.value] =
                rawVal !== undefined && rawVal !== '' && !isNaN(parsed)
                  ? parsed
                  : null;
            });
      
            return newRes;
          });
        
        setChartConfig({ datas, axisSettings, pollutantList });
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
    
    const getYAxisDomain = (axis) => {
        if(axis.isAuto) {
            if(axis.selectedOptions.findIndex(option => option.value === "pressure") !== -1) {
                return [0, 1050];
            } else if(axis.selectedOptions.findIndex(option => option.value === 'wd') !== -1) {
                return [0, 360];
            }
            return ['0', 'auto'];
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
            {type === 'weatherRvwr' && (
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
                                <FlexColWrapper className="w-full items-start justify-between gap-3">
                                    {axisSettings.map((axis, idx) => (
                                        <FlexRowWrapper key={axis.label} className="items-center gap-4">
                                            <div className="w-20 text-center">
                                                <span className="text-base font-medium text-gray-700">{axis.label}</span>
                                            </div>
                                                
                                            <div className="flex-1">
                                                <CustomMultiSelect
                                                    options={pollutantList}
                                                    setOutsideSelectedOptions={selected =>
                                                        updateAxisSettings(idx, {selectedOptions: selected})
                                                    }
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
                                <FlexRowWrapper className="gap-2 mt-1.5">
                                    <Button
                                        onClick={handleClickDrawChart}
                                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
                                    >
                                        그래프 그리기
                                    </Button>
                                </FlexRowWrapper>
                            </FlexRowWrapper>
                            {chartConfig && (
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
                        </>
                    )}
                </FlexColWrapper>
            )}
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
  