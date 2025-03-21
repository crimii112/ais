import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAisNav } from '@/context/AisNavContext';
import { FlexRowWrapper, FlexColWrapper, Button } from '@/components/ui/common';

const AisContent = () => {
  const { tabList, setTabList } = useAisNav();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [prevTabListLength, setPrevTabListLength] = useState(0);
  const [clickedCloseBtnIdx, setClickedCloseBtnIdx] = useState();

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
        if (clickedCloseBtnIdx != tabList.length) {
          setActiveTabIndex(activeTabIndex);
        } else if (clickedCloseBtnIdx - activeTabIndex != 1) {
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

  // tab close
  const handleRemoveTab = idx => {
    setClickedCloseBtnIdx(idx);
    const newTabList = tabList.filter((_, i) => i !== idx);
    setTabList(newTabList);
  };

  return (
    <div className="relative w-full h-full">
      <FlexRowWrapper className="w-full h-12 justify-start overflow-x-auto scrollbar-hide whitespace-nowrap bg-blue-900 pt-1.5">
        {tabList.map((tab, idx) => (
          <FlexRowWrapper
            key={idx}
            className={`px-2.5 h-full transition-all bg-white ${
              idx === activeTabIndex
                ? 'bg-white text-black'
                : 'bg-blue-900 text-white'
            } `}
          >
            <Button
              id={idx}
              onClick={() => setActiveTabIndex(idx)}
              className="px-1 rounded-none bg-transparent text-base"
            >
              {tab.title}
            </Button>
            <X className="w-4 h-4 ml-1" onClick={() => handleRemoveTab(idx)} />
          </FlexRowWrapper>
        ))}
      </FlexRowWrapper>
      {tabList.map((tab, idx) => (
        <TabContentWrapper
          key={idx}
          className={`flex-col ${idx === activeTabIndex ? 'flex' : 'hidden'}`}
        >
          <FlexColWrapper className="gap-4 w-full h-full p-4">
            {tab.content}
          </FlexColWrapper>
        </TabContentWrapper>
      ))}
    </div>
  );
};

export { AisContent };

// tab 관련 UI - TabContentWrapper
const TabContentWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('absolute w-full bg-white', className)} {...props}>
      {children}
    </div>
  );
};
TabContentWrapper.displayName = 'TabContentWrapper';
