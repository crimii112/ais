import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart as PChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

const PieChart = ({ datas, yAxisSettings }) => {
  const [processedData, setProcessedData] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    setTotalSum(0); // totalSum 초기화
    setProcessedData([]); // processedData 초기화

    if (!datas || !datas.rstList) return;

    const selectedOptions = yAxisSettings[0].selectedOptions;
    const clonedData = { ...datas.rstList[0] };

    const chartData = selectedOptions.map(option => {
      const rawVal = clonedData[option.value];
      const parsed = parseFloat(rawVal);
      clonedData[option.value] =
        rawVal !== undefined && rawVal !== '' && !isNaN(parsed) ? parsed : null;

      const sum = !isNaN(parsed) ? parsed : 0;
      setTotalSum(prevSum => prevSum + sum);

      return {
        name: option.text,
        value: clonedData[option.value],
      };
    });

    setProcessedData(chartData);
  }, [datas, yAxisSettings]);

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

  const RADIAN = Math.PI / 180;
  const customizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    payload,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percent = ((payload.value / totalSum) * 100).toFixed(1);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        className="font-semibold"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="center"
      >
        {`${payload.name}: ${percent}%`}
      </text>
    );
  };

  const customizedTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { value } = payload[0];
      return (
        <div className="bg-white border border-gray-300 rounded p-2 shadow-lg">
          <p className="text-base font-semibold">Value: {value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <PChart>
        <Pie
          data={processedData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={250}
          label={customizedLabel}
          labelLine={false}
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={customizedTooltip} />
      </PChart>
    </ResponsiveContainer>
  );
};
export { PieChart };

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
