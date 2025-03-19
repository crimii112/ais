import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAisNav } from '@/context/AisNavContext';

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
      <TabWrapper>
        {tabList.map((tab, idx) => (
          <TabButtonWrapper
            key={idx}
            className={`${
              idx === activeTabIndex
                ? 'bg-white text-black'
                : 'bg-blue-900 text-white'
            }`}
          >
            <TabButton id={idx} onClick={() => setActiveTabIndex(idx)}>
              {tab.title}
            </TabButton>
            <X className="w-4 h-4 ml-1" onClick={() => handleRemoveTab(idx)} />
          </TabButtonWrapper>
        ))}
      </TabWrapper>
      {tabList.map((tab, idx) => (
        <TabContentWrapper
          key={idx}
          className={`flex-col ${idx === activeTabIndex ? 'flex' : 'hidden'}`}
        >
          {/* <TabContentRoot>{tab.heading + ' > ' + tab.title}</TabContentRoot> */}
          <TabContent>{tab.content}</TabContent>
        </TabContentWrapper>
      ))}
    </div>
  );
};

export { AisContent };

// tab 관련 UI - TabWrapper, TabButtonWrapper, TabButton, TabContentWrapper
const TabWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-row w-full h-12 items-center overflow-x-auto scrollbar-hide whitespace-nowrap bg-blue-900 pt-1.5',
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
    <div
      className={cn(
        'flex flex-row items-center px-2.5 h-full transition-all bg-white',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TabButtonWrapper.displayName = 'TabButtonWrapper';

const TabButton = ({ className, children, ...props }) => {
  return (
    <button
      className={cn('whitespace-nowrap w-full px-1', className)}
      {...props}
    >
      {children}
    </button>
  );
};
TabButton.displayName = 'TabButton';

const TabContentWrapper = ({ className, children, ...props }) => {
  return (
    <div className={cn('absolute w-full', className)} {...props}>
      {children}
    </div>
  );
};
TabContentWrapper.displayName = 'TabContentWrapper';

const TabContentRoot = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('w-full px-2 py-1 my-1 bg-gray-100 text-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
};
TabContentRoot.displayName = 'TabContentRoot';

const TabContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('w-full h-full p-2', className)} {...props}>
      {children}
    </div>
  );
};
TabContent.displayName = 'TabContent';
