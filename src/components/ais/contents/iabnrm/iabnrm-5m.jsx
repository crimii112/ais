import { useEffect, useState } from 'react';

import usePostRequest from '@/hooks/usePostRequest';
import { SearchFrame } from '@/components/ais/search-frame';
import { SearchDate } from '@/components/ais/search-date';
import { SearchStation } from '@/components/ais/search-station';
import { SearchIabnrmCond } from '@/components/ais/search-iabnrm-cond';

const Iabnrm5M = ({ type }) => {
  const postMutation = usePostRequest();

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  const [dateList, setDateList] = useState([]);
  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    // console.log(dateList);
    // console.log(stationList);
  }, [dateList, stationList]);

  return (
    <>
      <SearchFrame>
        <SearchDate setDateList={setDateList} dateType={'iabnrm'} />
        <SearchStation
          title="대기측정소"
          siteType="iabnrm"
          onTme={false}
          setStationList={setStationList}
        />
        <SearchIabnrmCond />
      </SearchFrame>
    </>
  );
};

export { Iabnrm5M };
