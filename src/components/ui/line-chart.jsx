import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { FlexColWrapper, GridWrapper } from './common';
import CustomMultiSelect from './custom-multiple-select';
import randomColor from 'randomcolor';

const LineChart = ({ datas }) => {
  const [pollutantList, setPollutantList] = useState([]);
  const [selectedLeftOptions, setSelectedLeftOptions] = useState([]);
  const [selectedRightOptions, setSelectedRightOptions] = useState([]);

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

    // 물질 type 변경: string -> float
    datas.rstList.map(res =>
      arr
        .slice(2, 58)
        .map(head => (res[head.value] = parseFloat(res[head.value])))
    );
  }, [datas]);

  return (
    <FlexColWrapper className="w-full p-6 gap-2 border-2 border-gray-300 items-baseline">
      <GridWrapper className="grid-cols-[0.5fr_5fr_0.5fr_0.5fr_0.5fr] gap-2 items-stretch">
        <label className="my-auto whitespace-nowrap">Y-Left</label>
        <CustomMultiSelect
          options={pollutantList}
          setOutsideSelectedOptions={setSelectedLeftOptions}
        />
      </GridWrapper>
      <GridWrapper className="grid-cols-[0.5fr_5fr_0.5fr_0.5fr_0.5fr] gap-2 items-stretch">
        <label className="my-auto whitespace-nowrap">Y-Right</label>
        <CustomMultiSelect
          options={pollutantList}
          setOutsideSelectedOptions={setSelectedRightOptions}
        />
      </GridWrapper>
      {datas !== undefined && (
        <ResponsiveContainer width="100%" height={700}>
          <ComposedChart data={datas.rstList}>
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '30px' }}
            />
            <Tooltip />
            <CartesianGrid strokeDasharray="3" vertical={false} />
            <XAxis
              dataKey="groupdate"
              allowDuplicatedCategory={false}
              label={{
                value: '측정일자',
                position: 'bottom',
                fontWeight: 'bold',
              }}
            />
            <YAxis
              yAxisId="left"
              type="number"
              domain={['dataMin', 'dataMax']}
              fontSize={12}
              label={{
                value: selectedLeftOptions.map(option => ' ' + option.text),
                angle: -90,
                position: 'insideLeft',
                fontWeight: 'bold',
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              type="number"
              domain={['dataMin', 'dataMax']}
              fontSize={12}
              label={{
                value: selectedRightOptions.map(option => ' ' + option.text),

                angle: -90,
                position: 'insideRight',
                fontWeight: 'bold',
              }}
            />
            {datas.rstList2.map(el =>
              selectedLeftOptions.map(leftOption => (
                <Line
                  key={el.groupNm + ' - ' + leftOption.text}
                  data={datas.rstList.filter(
                    data => data.groupNm === el.groupNm
                  )}
                  yAxisId="left"
                  dataKey={leftOption.value}
                  name={el.groupNm + ' - ' + leftOption.text}
                  stroke={randomColor()}
                />
              ))
            )}
            {datas.rstList2.map(el =>
              selectedRightOptions.map(rightOption => (
                <Line
                  key={el.groupNm + ' - ' + rightOption.text}
                  data={datas.rstList.filter(
                    data => data.groupNm === el.groupNm
                  )}
                  yAxisId="right"
                  dataKey={rightOption.value}
                  name={el.groupNm + ' - ' + rightOption.text}
                  stroke={randomColor()}
                />
              ))
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </FlexColWrapper>
  );
};

export { LineChart };
