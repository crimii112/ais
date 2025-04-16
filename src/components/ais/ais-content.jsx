import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAisNav } from '@/context/AisNavContext';
import { FlexRowWrapper, FlexColWrapper, Button } from '@/components/ui/common';

/**
 * 탭 컨텐츠 컴포넌트
 * - Context API로 관리하고 있는 tabList를 사용합니다.
 * @returns {React.ReactNode} 탭 컨텐츠 컴포넌트
 */


const AisContent = () => {
  const { tabList, setTabList } = useAisNav();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [prevTabListLength, setPrevTabListLength] = useState(0);
  const [clickedCloseBtnIdx, setClickedCloseBtnIdx] = useState();

  // 탭 컨텐츠 캐싱용 ref
  const tabContentCacheRef = useRef({});

  // 캐시 초기화/추가 처리
  const memoizedTabContents = useMemo(() => {
    const cache = { ...tabContentCacheRef.current };

    tabList.forEach(tab => {
      if (!cache[tab.id]) {
        cache[tab.id] = (
          <FlexColWrapper className="gap-4 w-full h-full p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            {tab.content}
          </FlexColWrapper>
        );
      }
    });

    tabContentCacheRef.current = cache;
    return cache;
  }, [tabList]);

  // activeTab 관리
  useEffect(() => {
    setPrevTabListLength(tabList.length);

    // 1) add tab
    if (tabList.length > prevTabListLength) {
      setActiveTabIndex(tabList.length - 1);
    }
    // 2) remove tab
    else {
      if (tabList.length === activeTabIndex) {
        setActiveTabIndex(tabList.length - 1);
      } else if (clickedCloseBtnIdx > activeTabIndex) {
        if (clickedCloseBtnIdx !== tabList.length) {
          setActiveTabIndex(activeTabIndex);
        } else if (clickedCloseBtnIdx - activeTabIndex !== 1) {
          setActiveTabIndex(activeTabIndex);
        } else {
          setActiveTabIndex(tabList.length - 1);
        }
      } else {
        if (clickedCloseBtnIdx === activeTabIndex) {
          setActiveTabIndex(activeTabIndex);
        } else {
          setActiveTabIndex(activeTabIndex - 1);
        }
      }
    }
  }, [tabList]);

  // 탭 닫기 핸들러
  const handleRemoveTab = idx => {
    setClickedCloseBtnIdx(idx);
    const newTabList = tabList.filter((_, i) => i !== idx);
    setTabList(newTabList);
  };

  return (
    <div className="relative w-full">
      <FlexRowWrapper className="w-full h-12 justify-start overflow-x-auto scrollbar-hide whitespace-nowrap bg-gradient-to-r from-blue-900 to-blue-800 shadow-md">
        {tabList.map((tab, idx) => (
          <FlexRowWrapper
            key={idx}
            className={cn(
              'h-full transition-all duration-200 border-r border-blue-700',
              idx === activeTabIndex
                ? 'bg-white border-t-2 border-t-blue-700'
                : 'bg-blue-800/50 hover:bg-blue-700/50'
            )}
          >
            <Button
              id={idx}
              onClick={() => setActiveTabIndex(idx)}
              className={cn(
                'px-4 py-2 rounded-none bg-transparent text-base font-medium flex items-center gap-2 transition-all duration-200',
                idx === activeTabIndex 
                  ? 'text-blue-900' 
                  : 'text-white hover:text-blue-100'
              )}
            >
              {tab.title}
              <X
                className={cn(
                  'w-4 h-4 rounded transition-all duration-200',
                  idx === activeTabIndex 
                    ? 'text-blue-800 hover:bg-blue-100' 
                    : 'text-blue-200 hover:bg-blue-700'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTab(idx);
                }}
              />
            </Button>
          </FlexRowWrapper>
        ))}
      </FlexRowWrapper>
      {tabList.map((tab, idx) => (
        <TabContentWrapper
          key={tab.id}
          className={cn(
            'flex-col shadow-inner',
            idx === activeTabIndex ? 'flex' : 'hidden'
          )}
        >
          {memoizedTabContents[tab.id]}
        </TabContentWrapper>
      ))}
    </div>
  );
};

export { AisContent };

// tab 관련 UI - TabContentWrapper
const TabContentWrapper = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn(
        'absolute w-full bg-white/90 backdrop-blur-sm', 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
TabContentWrapper.displayName = 'TabContentWrapper';
