import { useState } from 'react';

import { SearchFrame } from '@/components/ais/search-frame';
import { SearchDate } from '@/components/ais/search-date';
import usePostRequest from '@/hooks/usePostRequest';

const Iabnrm5M = ({ type }) => {
  const postMutation = usePostRequest();

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  const [dateList, setDateList] = useState([]);

  return (
    <>
      <SearchFrame>
        <SearchDate setDateList={setDateList} dateType={'iabnrm'} />
      </SearchFrame>
    </>
  );
};

export { Iabnrm5M };
