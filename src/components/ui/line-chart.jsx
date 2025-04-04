import { useEffect, useRef, useState } from 'react';
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

const LineChart = ({ datas, yAxisSettings, pollutantList }) => {
  const [processedData, setProcessedData] = useState([]);
  const colorMapRef = useRef({}); // 여기에 색상 저장
  const colorIndexRef = useRef(0);

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

  if (
    !datas ||
    !datas.rstList ||
    !datas.rstList2 ||
    processedData.length === 0
  ) {
    return (
      <div className="flex flex-row w-full items-center justify-center py-5 text-xl font-semibold">
        그래프를 그릴 데이터가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={700}>
      <ComposedChart
        data={processedData}
        margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
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
          dataKey="groupdate"
          allowDuplicatedCategory={false}
          label={{
            value: '측정일자',
            position: 'bottom',
            fontWeight: 'bold',
          }}
          tick={{ fontSize: 12 }}
        />
        {yAxisSettings.map(
          axis =>
            axis.selectedOptions.length !== 0 && (
              <YAxis
                key={axis.label}
                yAxisId={`${axis.label}`}
                orientation={`${axis.orientation}`}
                type="number"
                domain={
                  axis.isAuto ? ['dataMin', 'dataMax'] : [axis.min, axis.max]
                }
                fontSize={12}
                label={{
                  value: axis.selectedOptions.map(option => ' ' + option.text),
                  angle: -90,
                  position:
                    axis.orientation === 'left' ? 'insideLeft' : 'insideRight',
                  fontWeight: 'bold',
                  dx: axis.orientation === 'left' ? 10 : -10,
                  dy: axis.orientation === 'left' ? 50 : -50,
                }}
                allowDataOverflow={true}
                tickCount={10}
              />
            )
        )}
        {datas.rstList2.map(el =>
          yAxisSettings.map(axis =>
            axis.selectedOptions.map(option => {
              const key = `${el.groupNm}-${option.text}`;
              return (
                <Line
                  key={el.groupNm + ' - ' + option.text}
                  data={processedData.filter(
                    data => data.groupNm === el.groupNm
                  )}
                  yAxisId={axis.label}
                  dataKey={option.value}
                  name={`${el.groupNm} - ${option.text}`}
                  stroke={getColorByKey(key)}
                  connectNulls={false}
                />
              );
            })
          )
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export { LineChart };

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
