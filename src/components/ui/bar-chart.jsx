import { useEffect, useState } from 'react';
import {
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  BarChart as BChart,
} from 'recharts';

const BarChart = ({ datas, yAxisSettings, pollutantList }) => {
  const [processedData, setProcessedData] = useState([]);

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

  return (
    <ResponsiveContainer width="100%" height={700}>
      <BChart data={processedData}>
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
        <YAxis />
        <Bar dataKey="data01" fill="#8884d8" />
      </BChart>
    </ResponsiveContainer>
  );
};
export { BarChart };
