import { useEffect, useRef, useState } from 'react';

import {
  FlexRowWrapper,
  FlexColWrapper,
  GridWrapper,
  Input,
  Button,
} from '@/components/ui/common';
import CustomMultiSelect from '@/components/ui/custom-multiple-select';
import { Loading } from '@/components/ui/loading';

const ContentChartFrame = ({ datas, isLoading }) => {
  const [pollutantList, setPollutantList] = useState([]);

  const [yAxisSettings, setYAxisSettings] = useState([
    {
      label: 'Y-Left',
      orientation: 'left',
      isAuto: true,
      min: 0,
      max: 100,
      selectedOptions: [],
    },
    {
      label: 'Y-Right',
      orientation: 'right',
      isAuto: true,
      min: 0,
      max: 100,
      selectedOptions: [],
    },
  ]);

  useEffect(() => {
    if (datas === undefined) return;

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

  const handleChangeCheckbox = e => {
    const inputs = document.querySelectorAll(`[id ^= ${e.target.id}]`);

    inputs.forEach(input => {
      if (input.type === 'number') {
        if (e.target.checked) input.readOnly = true;
        else input.readOnly = false;
      }
    });
  };

  const handleChangeScaleInput = () => {};

  const setSelectedOptions = selectedOptions => {
    console.log(selectedOptions);
  };
  const handleClickDrawChart = () => {
    console.log(yAxisSettings);
  };

  return (
    <FlexColWrapper className="w-full p-6 gap-2 border-2 border-gray-300 items-baseline">
      {isLoading ? (
        <Loading />
      ) : (
        <FlexRowWrapper className="w-full gap-2 items-stretch justify-between">
          <FlexColWrapper className="gap-2">
            {yAxisSettings.map(axis => (
              <GridWrapper
                key={axis.label}
                className="grid-cols-[0.7fr_6fr_0.5fr_0.7fr_0.7fr] gap-2 items-stretch"
              >
                <label className="my-auto whitespace-nowrap">
                  {axis.label}
                </label>
                <CustomMultiSelect
                  options={pollutantList}
                  setOutsideSelectedOptions={setSelectedOptions}
                />
                <label className="flex flex-row items-center whitespace-nowrap">
                  <Input
                    type="checkbox"
                    id={axis.orientation}
                    onChange={handleChangeCheckbox}
                    className="mr-1"
                    defaultChecked
                  />
                  자동
                </label>
                <Input
                  type="number"
                  id={axis.orientation + 'min'}
                  defaultValue={axis.min}
                  onChange={handleChangeScaleInput}
                  readOnly
                  className="w-20 read-only:bg-gray-200 text-center"
                />
                <Input
                  type="number"
                  id={axis.orientation + 'max'}
                  onChange={handleChangeScaleInput}
                  defaultValue={axis.max}
                  readOnly
                  className="w-20 read-only:bg-gray-200 text-center"
                />
              </GridWrapper>
            ))}

            {/* <GridWrapper className="grid-cols-[0.7fr_6fr_0.5fr_0.7fr_0.7fr] gap-2 items-stretch">
              <label className="my-auto whitespace-nowrap">Y-Right</label>
              <CustomMultiSelect
                options={pollutantList}
                setOutsideSelectedOptions={setSelectedRightOptions}
              />
              <label className="flex flex-row items-center whitespace-nowrap">
                <Input
                  type="checkbox"
                  id="right"
                  onChange={handleChangeCheckbox}
                  className="mr-1"
                  defaultChecked
                />
                자동
              </label>
              <Input
                type="number"
                ref={rMinRef}
                defaultValue={0}
                readOnly
                className="w-20 read-only:bg-gray-200 text-center"
              />
              <Input
                type="number"
                ref={rMaxRef}
                defaultValue={100}
                readOnly
                className="w-20 read-only:bg-gray-200 text-center"
              />
            </GridWrapper> */}
          </FlexColWrapper>
          <Button
            onClick={handleClickDrawChart}
            className="w-fit px-5 bg-blue-900 text-white"
          >
            그래프 그리기
          </Button>
        </FlexRowWrapper>
      )}
    </FlexColWrapper>
  );
};
export { ContentChartFrame };
