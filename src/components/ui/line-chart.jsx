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
    const color = strongColors[colorIndexRef.current % strongColors.length];
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

const strongColors = [
  '#d32f2f',
  '#f57c00',
  '#7b1fa2',
  '#689f38',
  '#fbc02d',
  '#4e342e',
  '#0288d1',
  '#33691e',
  '#512da8',
  '#0097a7',
  '#afb42b',
  '#8e24aa',
  '#00695c',
  '#1a237e',
  '#e64a19',
  '#5d4037',
  '#1976d2',
  '#c62828',
  '#fbc02d',
  '#6a1b9a',
  '#2e7d32',
  '#ef6c00',
  '#3949ab',
  '#00838f',
  '#9e9d24',
  '#ad1457',
  '#00796b',
  '#303f9f',
  '#ffa000',
  '#d84315',
  '#1b5e20',
  '#283593',
  '#ff5722',
  '#8d6e63',
  '#00796b',
  '#7c4dff',
  '#00acc1',
  '#827717',
  '#d81b60',
  '#009688',
  '#3f51b5',
  '#f44336',
  '#4caf50',
  '#e91e63',
  '#ff9800',
  '#9c27b0',
  '#03a9f4',
  '#cddc39',
  '#673ab7',
];
