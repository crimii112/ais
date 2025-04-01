import { useEffect, useState } from 'react';

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

const ContentChartFrame = ({ datas, isLoading }) => {
  const [pollutantList, setPollutantList] = useState([]); //multiSelect Options
  const [chartConfig, setChartConfig] = useState(null);
  const [yAxisSettings, setYAxisSettings] = useState([
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

  const handleClickDrawChart = () => {
    setChartConfig({ datas, yAxisSettings, pollutantList });
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
            <LineChart
              datas={chartConfig.datas}
              yAxisSettings={chartConfig.yAxisSettings}
              pollutantList={chartConfig.pollutantList}
            />
          )}
        </>
      )}
    </FlexColWrapper>
  );
};
export { ContentChartFrame };
