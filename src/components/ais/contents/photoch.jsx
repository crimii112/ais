import { useState } from 'react';

import { SearchDate } from '../search-date';
import { SearchFrame } from '../search-frame';

const PhotoCh = () => {
  const [dateList, setDateList] = useState([]);
  return (
    <>
      <SearchFrame>
        <SearchDate setDateList={setDateList} />
      </SearchFrame>
    </>
  );
};

export { PhotoCh };
