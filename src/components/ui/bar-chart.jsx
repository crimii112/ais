import { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart as BChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

import { FlexRowWrapper } from './common';

const BarChart = ({ datas, yAxisSettings, pollutantList }) => {
  const [processedData, setProcessedData] = useState([]);
  const colorMapRef = useRef({}); // 여기에 색상 저장
  const colorIndexRef = useRef(0);

  const [graphType, setGraphType] = useState('default');

  useEffect(() => {
    if (!datas || !datas.rstList) return;

    // 데이터 clone해서 타입 변환(string -> float)
    // clone 안하면 데이터 원본이 변경되어 table에 영향을 미치게 됨
    const clonedData = datas.rstList.map(res => {
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

    console.log(clonedData);
    setProcessedData(clonedData);
  }, [datas, pollutantList]);

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

  const handleChangeGraphType = e => {
    const selectedType = e.target.value;
    setGraphType(selectedType);
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <FlexRowWrapper className="justify-end gap-3 mr-3">
        <label>
          <input
            type="radio"
            name="type"
            value="default"
            defaultChecked
            className="mr-1"
            onChange={handleChangeGraphType}
          />
          기본형
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="stack"
            className="mr-1"
            onChange={handleChangeGraphType}
          />
          스택형
        </label>
      </FlexRowWrapper>
      <BChart
        data={processedData}
        margin={{ top: 20, right: 30, bottom: 30, left: 10 }}
        barGap={0}
        stackOffset="expand"
      >
        <CartesianGrid strokeDasharray="3" vertical={false} />
        <XAxis
          dataKey="groupdate"
          allowDuplicatedCategory={false}
          label={{
            value: '측정일자',
            position: 'bottom',
            fontWeight: 'bold',
          }}
          tick={{ fontSize: 12 }}
        />
        {yAxisSettings.map(axis => (
          <YAxis
            key={axis.label}
            type="number"
            domain={axis.isAuto ? ['auto', 'auto'] : [axis.min, axis.max]}
            tickCount={10}
            fontSize={12}
            allowDataOverflow={true}
          />
        ))}

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

        {datas.rstList2.map(el =>
          yAxisSettings.map(axis =>
            axis.selectedOptions.map(option => {
              const key = `${el.groupNm}-${option.text}`;
              return (
                <Bar
                  key={key}
                  data={processedData.filter(
                    data => data.groupNm === el.groupNm
                  )}
                  dataKey={option.value}
                  name={key}
                  fill={getColorByKey(key)}
                  stackId={graphType === 'stack' ? axis.label : undefined}
                  isAnimationActive={graphType === 'stack' ? false : true}
                />
              );
            })
          )
        )}
      </BChart>
    </ResponsiveContainer>
  );
};
export { BarChart };

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
