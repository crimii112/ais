import { useCallback, useState } from "react";

import { IntensiveDataFrame } from "./intensive-data-frame";
import { ContentChartFrame } from "@/components/ais/content-chart-frame";
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
        setChartConfig({ data, axisSettings, pollutantList });
    };

    return (
        <IntensiveDataFrame 
            type={type}
            onDataLoaded={handleDataLoaded}
            onLoadingChange={setIsLoading}
            initSettings={initSettings}
            // highlightedRow={highlightedRow}     
        >
            {
                type === 'weatherRvwr' && (
                    // <ContentChartFrame 
                    //     datas={contentData}
                    //     isLoading={isLoading}
                    //     type="line"
                    //     title="(단일)기상자료검토"
                    // />
                    <FlexColWrapper className="w-full p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                        {isLoading ? (
                            <div className="w-full h-[400px] flex items-center justify-center">
                                <Loading />
                            </div>
                        ) : (
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
                        )}
                    </FlexColWrapper>
                )
            }
        </IntensiveDataFrame>
    )
}

export { IntensiveWeather };