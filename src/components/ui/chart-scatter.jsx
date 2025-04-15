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
 * ScatterChart Component
 *
 * @param {Object} props.chartSettings - Settings for the chart
 * @param {Object} props.chartSettings.xAxis - X-axis configuration
 * @param {string} props.chartSettings.xAxis.dataKey - DataKey for X-axis
 * @param {string} props.chartSettings.xAxis.scale - Scale type for X-axis
 * @param {number[]} props.chartSettings.xAxis.domain - Domain range for X-axis
 * @param {number[]} props.chartSettings.xAxis.ticks - Ticks for X-axis
 * @param {Object} props.chartSettings.yAxis - Y-axis configuration
 * @param {string} props.chartSettings.yAxis.dataKey - DataKey for Y-axis
 * @param {string} props.chartSettings.yAxis.label - Label for Y-axis
 * @param {Object} props.chartSettings.data - Data for the chart, grouped by key
 * @param {any} props.chartSettings.tooltip - Custom Tooltip configuration
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
