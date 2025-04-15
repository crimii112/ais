import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

import {
  FlexRowWrapper,
  FlexColWrapper,
  GridWrapper,
  Input,
  Button,
} from '@/components/ui/common';
import CustomMultiSelect from '@/components/ui/custom-multiple-select';
import { Loading } from '@/components/ui/loading';
import { LineChart } from '@/components/ui/chart-line';
import { PieChart } from '@/components/ui/chart-pie';
import { BarChart } from '@/components/ui/chart-bar';

const CHART_SETTINGS = {
  line: {
    onScale: true,
    yAxisSettings: [
      { label: 'Y-Left1', orientation: 'left', isAuto: true, min: 0, max: 100, selectedOptions: [] },
      { label: 'Y-Left2', orientation: 'left', isAuto: true, min: 0, max: 100, selectedOptions: [] },
      { label: 'Y-Right1', orientation: 'right', isAuto: true, min: 0, max: 100, selectedOptions: [] },
      { label: 'Y-Right2', orientation: 'right', isAuto: true, min: 0, max: 100, selectedOptions: [] },
    ],
  },
  pie: {
    onScale: false,
    yAxisSettings: [{ label: '물질', selectedOptions: [] }],
  },
  bar: {
    onScale: true,
    yAxisSettings: [{ label: '물질', isAuto: true, min: 0, max: 100, selectedOptions: [] }],
  },
};

const ContentChartFrame = ({ datas, isLoading, type, title }) => {
  const config = CHART_SETTINGS[type];

  const [pollutantList, setPollutantList] = useState([]); //multiSelect Options
  const [chartConfig, setChartConfig] = useState(null);
  const [yAxisSettings, setYAxisSettings] = useState(config.yAxisSettings);

  useEffect(() => {
    if (!datas) return;

    // option value, text 설정
    const options = datas.headList.map((value, idx) => ({
      value,
      text: datas.headNameList[idx],
    }));

    // 'FLAG' 위치
    const flagIndex = options.findIndex(option => option.value === 'rflag');
    setPollutantList(options.slice(2, flagIndex));
  }, [datas]);

  const updateYAxisSettings = (idx, updates) => {
    setYAxisSettings(prev =>
      prev.map((axis, i) => (i === idx ? { ...axis, ...updates } : axis))
    );
  };

  // 그래프 그리기 버튼 클릭 이벤트
  const handleClickDrawChart = () => {
    setChartConfig({ datas, yAxisSettings, pollutantList });
  };

  // 그래프 이미지로 저장
  const handleSaveImage = async () => {
    await document.fonts.ready;
    const canvas = await html2canvas(
      document.getElementById(`${title}-${type}-chart-wrapper`),
      { backgroundColor: '#fff', useCORS: true, scale: 1.5}
    );
    const link = document.createElement('a');
    link.download = `${title}-${type}Chart.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <FlexColWrapper className="w-full p-6 gap-2 border-2 border-gray-300 items-baseline">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <FlexRowWrapper className="w-full gap-2 items-stretch justify-between pb-4 border-b-2 border-gray-500">
            <FlexColWrapper className="gap-2">
              {yAxisSettings.map((axis, idx) => (
                <GridWrapper
                  key={axis.label}
                  className="grid-cols-[0.7fr_6fr_0.5fr_0.7fr_0.7fr] gap-2 items-stretch"
                >
                  <label className="my-auto whitespace-nowrap">{axis.label}</label>
                  <CustomMultiSelect
                    options={pollutantList}
                    setOutsideSelectedOptions={selected =>
                      updateYAxisSettings(idx, {selectedOptions: selected})
                    }
                  />
                  {config.onScale && (
                    <>
                      <label className="flex flex-row items-center whitespace-nowrap">
                        <Input
                          type="checkbox"
                          checked={axis.isAuto}
                          onChange={e => updateYAxisSettings(idx, {isAuto: e.target.checked})}
                          className="mr-1"
                        />
                        자동
                      </label>
                      <Input
                        type="number"
                        value={axis.min}
                        onChange={e => updateYAxisSettings(idx, {min: Number(e.target.value)})}
                        readOnly={axis.isAuto}
                        className="w-20 read-only:bg-gray-200 text-center"
                      />
                      <Input
                        type="number"
                        value={axis.max}
                        onChange={e => updateYAxisSettings(idx, {max: Number(e.target.value)})}
                        readOnly={axis.isAuto}
                        className="w-20 read-only:bg-gray-200 text-center"
                      />
                    </>
                  )}
                </GridWrapper>
              ))}
            </FlexColWrapper>
            <Button onClick={handleClickDrawChart} className="w-fit px-5 bg-blue-900 text-white">
              그래프 그리기
            </Button>
          </FlexRowWrapper>
          {chartConfig && (
            <>
              <div id={`${title}-${type}-chart-wrapper`} className="w-full h-full p-2">
                {type === 'line' && (
                  <LineChart
                    datas={chartConfig.datas}
                    yAxisSettings={chartConfig.yAxisSettings}
                    pollutantList={chartConfig.pollutantList}
                  />
                )}
                {type === 'pie' && (
                  <PieChart
                    datas={chartConfig.datas}
                    yAxisSettings={chartConfig.yAxisSettings}
                  />
                )}
                {type === 'bar' && (
                  <BarChart
                    datas={chartConfig.datas}
                    yAxisSettings={chartConfig.yAxisSettings}
                    pollutantList={chartConfig.pollutantList}
                  />
                )}
              </div>
              <FlexRowWrapper className="w-full justify-end">
                <Button onClick={handleSaveImage} className="w-fit px-4 bg-blue-900 text-white">
                  이미지 저장
                </Button>
              </FlexRowWrapper>
            </>
          )}
        </>
      )}
    </FlexColWrapper>
  );
};
export { ContentChartFrame };
