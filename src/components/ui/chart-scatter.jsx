import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart as SChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * 산점도 그래프 컴포넌트
 * - 정해진 chartSettings 형식에 맞춰서 데이터만 보내면 그래프 그릴 수 있습니다. 아래 예시 참고.
 * @param {Object} chartSettings 그래프 설정
 * @example chartSettings = {xAxis: {dataKey: 'x', scale: 'log', domain: [10.6, 10000], ticks: [10, 100, 1000, 10000]}, 
 *                           yAxis: {dataKey: 'y', label: 'dN/dlogdP (#/cm3)'}, 
 *                           data: {수도권: [{groupNm: '수도권', groupdate: '2015/01/01 01', type: "dN/dlogdP", x: 10.6, y: 100}, ...]}, 
 *                           tooltip: <CustomTooltip />}
 * @returns {React.ReactNode} 산점도 그래프 컴포넌트
 */


const ScatterChart = ({ chartSettings }) => {
  const { xAxis, yAxis, data, tooltip } = chartSettings;

  return (
    <ResponsiveContainer width="100%" height={700}>
      <SChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
        <CartesianGrid strokeDasharray="3" vertical={false} />
        <XAxis
          type="number"
          dataKey={xAxis.dataKey}
          scale={xAxis.scale}
          domain={xAxis.domain}
          ticks={xAxis.ticks}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey={yAxis.dataKey}
          label={{
            value: yAxis.label,
            angle: -90,
            position: 'insideLeft',
          }}
          tick={{ fontSize: 12 }}
        />
        {Object.entries(data).map(([group, groupData], idx) => (
          <Scatter
            key={group}
            name={group}
            data={groupData}
            fill={COLORS[idx % COLORS.length]}
            stroke="black"
          />
        ))}
        <Tooltip content={tooltip} />
        <Legend />
      </SChart>
    </ResponsiveContainer>
  );
};

export { ScatterChart };

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
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
