import { useEffect, useState } from 'react';
import randomColor from 'randomcolor';
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
  const typeCastingDatas = datas;

  useEffect(() => {
    // 물질 type 변경: string -> float
    typeCastingDatas.rstList.forEach(res => {
      pollutantList.forEach(option => {
        const val = res[option.value];
        if (val !== undefined) res[option.value] = parseFloat(val);
      });
    });

    console.log(typeCastingDatas);
  }, [datas]);

  return (
    <ResponsiveContainer width="100%" height={700}>
      <ComposedChart data={typeCastingDatas.rstList}>
        <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '30px' }} />
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
        {yAxisSettings.map(axis => (
          <YAxis
            key={axis.label}
            yAxisId={`${axis.orientation}`}
            orientation={`${axis.orientation}`}
            type="number"
            domain={axis.isAuto ? ['dataMin', 'dataMax'] : [axis.min, axis.max]}
            fontSize={12}
            label={{
              value: axis.selectedOptions.map(option => ' ' + option.text),
              angle: -90,
              position: `${
                axis.orientation === 'left' ? 'insideLeft' : 'insideRight'
              }`,
              fontWeight: 'bold',
            }}
          />
        ))}
        {typeCastingDatas.rstList2.map(el =>
          yAxisSettings.map(axis =>
            axis.selectedOptions.map(option => (
              <Line
                key={el.groupNm + ' - ' + option.text}
                data={typeCastingDatas.rstList.filter(
                  data => data.groupNm === el.groupNm
                )}
                yAxisId={axis.orientation}
                dataKey={option.value}
                name={`${el.groupNm} - ${option.text}`}
                stroke={getRandomColor()}
                connectNulls={false}
              />
            ))
          )
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export { LineChart };

function getRandomColor() {
  const index = Math.floor(Math.random() * strongColors.length);
  return strongColors[index];
}

const strongColors = [
  '#FF0000',
  '#E60026',
  '#C70039',
  '#900C3F',
  '#8B0000',
  '#FF5733',
  '#FF6F00',
  '#FF8C00',
  '#FF9900',
  '#FFB300',
  '#FFA500',
  '#CC5500',
  '#B7410E',
  '#A52A2A',
  '#800000',
  '#FF1493',
  '#C71585',
  '#8B008B',
  '#6A0DAD',
  '#4B0082',
  '#2E0854',
  '#1A1AFF',
  '#0000FF',
  '#0033A0',
  '#00008B',
  '#191970',
  '#001f3f',
  '#005f73',
  '#008080',
  '#006400',
  '#228B22',
  '#2E8B57',
  '#006400',
  '#013220',
  '#0B3D91',
  '#3D9970',
  '#2F4F4F',
  '#2C3E50',
  '#1C1C1C',
  '#111111',
  '#333333',
  '#4A4A4A',
  '#555555',
  '#666666',
  '#800080',
  '#9932CC',
  '#9400D3',
  '#7B68EE',
  '#483D8B',
  '#1E1E1E',
];
