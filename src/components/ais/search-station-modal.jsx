import { useState } from 'react';
import { ModalFrame, ModalHeader, ModalContent } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

const SearchStationModal = ({
  tabType,
  setIsModalOpened,
  setMultipleStationList,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  //   // Content 1) 시도 선택 방식
  //   const ContentSelectSido = (
  //     <SelectStationContainer>
  //       <SelectStationDiv>
  //         <div className="textTitle">시도</div>
  //         <CheckboxDiv>
  //           {sidoCheckboxList.map(sido => (
  //             <label key={sido.value}>
  //               <input
  //                 type="checkbox"
  //                 id={sido.text}
  //                 checked={sido.checked}
  //                 onChange={handleChangeCheckbox}
  //               />
  //               {sido.text}
  //             </label>
  //           ))}
  //         </CheckboxDiv>
  //       </SelectStationDiv>
  //       <SelectButtonDiv>
  //         <RightArrowIcon width="30px" height="30px" onClick={getSearchStation} />
  //       </SelectButtonDiv>
  //     </SelectStationContainer>
  //   );

  //   // Content 2) 검색 방식
  //   const ContentSearch = (
  //     <SelectStationContainer>
  //       <SelectStationDiv>
  //         <div className="gridTitle">
  //           <select
  //             name="searchTypeSidoNm"
  //             onChange={e => setSelectboxSidoNm([e.target.value])}
  //           >
  //             {RegionOptionList.map(region => (
  //               <option key={region.text} value={region.text}>
  //                 {region.text}
  //               </option>
  //             ))}
  //           </select>
  //           <input ref={tbxSidoSearchRef} />
  //           <button onClick={getSearchStation}>검색</button>
  //         </div>
  //         <SearchDiv>
  //           <select multiple ref={searchStationRef}>
  //             {searchStationList &&
  //               searchStationList.map(station => (
  //                 <option key={station.siteCd}>{station.siteData}</option>
  //               ))}
  //           </select>
  //         </SearchDiv>
  //       </SelectStationDiv>
  //       <SelectButtonDiv>
  //         <RightArrowIcon
  //           width="30px"
  //           height="30px"
  //           onClick={handleClickSearchBtn}
  //         />
  //       </SelectButtonDiv>
  //     </SelectStationContainer>
  //   );

  //   // Content 3) 기타 방식
  //   const ContentEtc = (
  //     <SelectStationContainer>
  //       <SelectStationDiv>
  //         <div className="textTitle">기타</div>
  //         <RadioBtnDiv>
  //           {EtcRadioBtnList.map(etc => (
  //             <label key={etc.text}>
  //               <input
  //                 type="radio"
  //                 name="etc"
  //                 defaultChecked={etc.text === '전국' && 'checked'}
  //                 id={etc.text}
  //                 onClick={e => setRadioSidoNm(e.target.id)}
  //               />
  //               {etc.text}
  //             </label>
  //           ))}
  //         </RadioBtnDiv>
  //       </SelectStationDiv>
  //       <SelectButtonDiv>
  //         <RightArrowIcon width="30px" height="30px" onClick={getSearchStation} />
  //       </SelectButtonDiv>
  //     </SelectStationContainer>
  //   );

  // tabType에 따른 탭 구성
  const tabList =
    tabType === 1
      ? [
          { title: '시도 선택 방식', content: '시도 선택' },
          { title: '검색 방식', content: '검색' },
          { title: '기타 방식', content: '기타' },
        ]
      : tabType === 2
      ? [
          { title: '시도 선택 방식', content: ContentSelectSido },
          { title: '검색 방식', content: ContentSearch },
        ]
      : tabType === 3 && [
          { title: '가까운 측정소 검색 방식', content: <div></div> },
          { title: '검색 방식', content: ContentSearch },
        ];

  const handleCloseModal = () => {
    setIsModalOpened(false);
  };

  return (
    <ModalFrame>
      <ModalHeader title="측정소 선택" onClick={handleCloseModal} />
      <ModalContent>
        <TabWrapper>
          <TabButtonWrapper>
            {tabList.map((tab, idx) => (
              <TabButton
                key={tab.title}
                id={idx}
                className={`${
                  idx === activeTabIndex
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-black'
                }`}
                onClick={() => setActiveTabIndex(idx)}
              >
                {tab.title}
              </TabButton>
            ))}
          </TabButtonWrapper>
          <div>tms</div>
        </TabWrapper>
        {/* {tabList.map((tab, idx) => (
          <div key={idx} className="absolute w-full border-1 border-blue-900">
            {tab.content}
          </div>
        ))} */}
      </ModalContent>
    </ModalFrame>
  );
};

export { SearchStationModal };

const TabWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between w-full h-9',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TabWrapper.displayName = 'TabWrapper';

const TabButtonWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-row gap-0.5 h-full', className)} {...props}>
      {children}
    </div>
  );
};

const TabButton = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        'h-full whitespace-nowrap px-4 rounded-t-lg bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
TabButton.displayName = 'TabButton';
