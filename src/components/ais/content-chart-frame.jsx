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
import { LineChart } from '@/components/ui/line-chart';
import { PieChart } from '@/components/ui/pie-chart';

const ContentChartFrame = ({ datas, isLoading, type }) => {
  const [pollutantList, setPollutantList] = useState([]); //multiSelect Options
  const [chartConfig, setChartConfig] = useState(null);
  const [yAxisSettings, setYAxisSettings] = useState([]);

  // chart type에 따른 yAxisSettings
  useEffect(() => {
    if (type === 'line') {
      setYAxisSettings([
        {
          label: 'Y-Left1',
          orientation: 'left',
          isAuto: true,
          min: 0,
          max: 100,
          selectedOptions: [],
        },
        {
          label: 'Y-Left2',
          orientation: 'left',
          isAuto: true,
          min: 0,
          max: 100,
          selectedOptions: [],
        },
        {
          label: 'Y-Right1',
          orientation: 'right',
          isAuto: true,
          min: 0,
          max: 100,
          selectedOptions: [],
        },
        {
          label: 'Y-Right2',
          orientation: 'right',
          isAuto: true,
          min: 0,
          max: 100,
          selectedOptions: [],
        },
      ]);
    } else if (type === 'pie') {
      setYAxisSettings([
        {
          label: 'Y-Left',
          orientation: 'left',
          isAuto: true,
          min: 0,
          max: 100,
          selectedOptions: [],
        },
      ]);
    }
  }, [type]);

  useEffect(() => {
    if (datas === undefined) return;

    setChartConfig(null);
    // option value, text
    const arr = [];
    datas.headList.map(head => {
      arr.push({ value: head });
    });
    datas.headNameList.map((headName, idx) => {
      arr[idx].text = headName;
    });

    setPollutantList(arr.slice(2, 58));
  }, [datas]);

  const handleChangeCheckbox = (e, idx) => {
    const checked = e.target.checked;

    setYAxisSettings(prev =>
      prev.map((axis, i) => (i === idx ? { ...axis, isAuto: checked } : axis))
    );
  };

  const handleChangeScaleInput = (e, idx, key) => {
    const value = e.target.value;

    setYAxisSettings(prev =>
      prev.map((axis, i) =>
        i === idx ? { ...axis, [key]: Number(value) } : axis
      )
    );
  };

  const setSelectedOptions = (selectedOptions, idx) => {
    setYAxisSettings(prev =>
      prev.map((axis, i) => (i === idx ? { ...axis, selectedOptions } : axis))
    );
  };

  // 그래프 그리기 버튼 클릭 이벤트
  const handleClickDrawChart = () => {
    setChartConfig({ datas, yAxisSettings, pollutantList });
  };

  // 그래프 이미지로 저장
  const handleSaveImage = async () => {
    await document.fonts.ready;

    const canvas = await html2canvas(document.getElementById('chart-wrapper'), {
      backgroundColor: '#fff',
      useCORS: true,
      scale: 1.5,
    });

    const link = document.createElement('a');
    if (type === 'line') link.download = 'lineChart.png';
    else if (type === 'pie') link.download = 'pieChart.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <FlexColWrapper className="w-full p-6 gap-2 border-2 border-gray-300 items-baseline">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <FlexRowWrapper className="w-full gap-2 items-stretch justify-between">
            <FlexColWrapper className="gap-2">
              {yAxisSettings.map((axis, idx) => (
                <GridWrapper
                  key={axis.label}
                  className="grid-cols-[0.7fr_6fr_0.5fr_0.7fr_0.7fr] gap-2 items-stretch"
                >
                  <label className="my-auto whitespace-nowrap">
                    {axis.label}
                  </label>
                  <CustomMultiSelect
                    options={pollutantList}
                    setOutsideSelectedOptions={selected =>
                      setSelectedOptions(selected, idx)
                    }
                  />
                  <label className="flex flex-row items-center whitespace-nowrap">
                    <Input
                      type="checkbox"
                      checked={axis.isAuto}
                      onChange={e => handleChangeCheckbox(e, idx)}
                      className="mr-1"
                    />
                    자동
                  </label>
                  <Input
                    type="number"
                    value={axis.min}
                    onChange={e => handleChangeScaleInput(e, idx, 'min')}
                    readOnly={axis.isAuto}
                    className="w-20 read-only:bg-gray-200 text-center"
                  />
                  <Input
                    type="number"
                    value={axis.max}
                    onChange={e => handleChangeScaleInput(e, idx, 'max')}
                    readOnly={axis.isAuto}
                    className="w-20 read-only:bg-gray-200 text-center"
                  />
                </GridWrapper>
              ))}
            </FlexColWrapper>
            <Button
              onClick={handleClickDrawChart}
              className="w-fit px-5 bg-blue-900 text-white"
            >
              그래프 그리기
            </Button>
          </FlexRowWrapper>
          {chartConfig && (
            <>
              <div id="chart-wrapper" className="w-full h-full p-2">
                {type === 'line' && (
                  <LineChart
                    datas={chartConfig.datas}
                    yAxisSettings={chartConfig.yAxisSettings}
                    pollutantList={chartConfig.pollutantList}
                  />
                )}
                {type === 'pie' && <PieChart datas={chartConfig.datas} />}
              </div>
              <FlexRowWrapper className="w-full justify-end">
                <Button onClick={handleSaveImage} className="w-fit ">
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
