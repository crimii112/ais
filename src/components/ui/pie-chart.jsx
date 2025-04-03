import { useEffect } from 'react';
import { Pie, ResponsiveContainer } from 'recharts';

const PieChart = ({ datas }) => {
  useEffect(() => {
    console.log(datas);
  }, []);

  return (
    <div>파이그래프</div>
    // <ResponsiveContainer width="100%" height={500}>
    //   <PieChart>
    //     <Pie data={datas}></Pie>
    //   </PieChart>
    // </ResponsiveContainer>
  );
};
export { PieChart };
