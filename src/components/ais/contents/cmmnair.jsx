import { useState } from 'react';

import { SearchFrame } from '../search-frame';
import { SearchDate } from '../search-date';
import { SearchStation } from '../search-station';

const CmmnAir = () => {
  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);

  const handleClickSearchBtn = async () => {
    const apiData = {
      page: 'arpltn/cmmair',
      date: dateList,
      site: stationList,
    };

    console.log(JSON.stringify(apiData));
  };
  return (
    <>
      <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
        <SearchDate setDateList={setDateList} />
        <SearchStation title="대기측정소" setStationList={setStationList} />
      </SearchFrame>
    </>
  );
};

export { CmmnAir };
