import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useMemo, useCallback } from 'react';

import { useAisNav } from '@/context/AisNavContext';
import {
  HeaderWrapper,
  Logo,
  Navbar,
  NavbarMenu,
} from '@/components/ui/navbar';
import { CmmnAir } from './contents/cmmnair';
import { PhotoCh } from './contents/photoch';
import { Toxic } from './contents/toxic';
import { Test } from './contents/test';
import { IntensivePsize } from './contents/intensive-psize';

/**
 * 대기측정망 자료관리 시스템 네비게이션 아이템 데이터
 * @type {Object}
 */
const data = {
  navItems: [
    {
      id: 0,
      title: '일반 대기질 데이터 분석',
      subItems: [
        {
          pathName: 'cmmnAir',
          title: '일반대기 검색',
          content: <CmmnAir />,
        },
        {
          pathName: 'nav1-sub2',
          title: 'nav1-sub2',
          content: 'nav1-sub2',
        },
        {
          pathName: 'nav1-sub3',
          title: 'nav1-sub3',
          content: 'nav1-sub3',
        },
      ],
    },
    {
      id: 1,
      title: '특수 대기질 테이터 분석',
      subItems: [
        {
          pathName: 'photoCh',
          title: '광화학 데이터 그래프',
          content: <PhotoCh type="line" />,
        },
        {
          pathName: 'photoChPie',
          title: '광화학 성분 파이그래프',
          content: <PhotoCh type="pie" />,
        },
        {
          pathName: 'photoChBar',
          title: '광화학 성분 막대그래프',
          content: <PhotoCh type="bar" />,
        },
        {
          pathName: 'photoChMedian',
          title: '광화학 일중간값 그래프',
          content: <PhotoCh type="medianLine" />,
        },
        {
          pathName: 'toxic',
          title: '유해자동 데이터 그래프',
          content: <Toxic type="line" />,
        },
        {
          pathName: 'toxicPie',
          title: '유해자동 파이그래프',
          content: <Toxic type="pie" />,
        },
        {
          pathName: 'toxicBar',
          title: '유해자동 막대그래프',
          content: <Toxic type="bar" />,
        },
        {
          pathName: 'toxicMedian',
          title: '유해자동 일중간값 그래프',
          content: <Toxic type="medianLine" />,
        },
      ],
    },
    {
      id: 2,
      title: 'Nav3',
      subItems: [
        {
          pathName: 'testLog',
          title: '테스트(log scale)',
          content: <Test />,
        },
        {
          pathName: 'intensivePsize',
          title: '(단일)입경크기분포',
          content: <IntensivePsize />,
        },
        {
          pathName: 'nav3-sub3',
          title: 'nav3-sub3',
          content: 'nav3-sub3',
        },
      ],
    },
  ],
};

/**
 * 대기측정망 자료관리 시스템 네비게이션 컴포넌트
 * @returns {React.ReactNode}
 */
const AisNav = () => {
  const { tabList, setTabList } = useAisNav();

  /**
   * 탭 추가 핸들러
   * @param {Object} subItem - 탭 추가 핸들러
   */
  const handleAddTab = useCallback((subItem) => {
    setTabList(prev => [...prev, { ...subItem, id: uuidv4() }]);
  }, [setTabList]);

  const memoizedNavItems = useMemo(() => data.navItems, []);

  return (
    <HeaderWrapper className="bg-white border-b border-gray-200 shadow-sm">
      <Logo className="px-6">
        <span className="text-xl font-semibold text-gray-900">
          <Link to="/ais">대기측정망 자료관리 시스템</Link>
        </span>
      </Logo>
      <Navbar>
        <NavbarMenu className="gap-2 px-2">
          {memoizedNavItems.map(item => (
            <Menu as="div" key={item.id} className="relative">
              <MenuButton
                as="button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                {item.title}
                <ChevronDown className="w-4 h-4" />
              </MenuButton>
              <MenuItems className="absolute mt-1 left-0 z-50 w-56 p-1 bg-white rounded-md shadow-lg border border-gray-200">
                {item.subItems.map(subItem => (
                  <MenuItem key={subItem.pathName}>
                    {({ active }) => (
                      <button
                        className={`w-full px-3 py-2 text-left rounded-md transition-colors duration-200 ${
                          active 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handleAddTab(subItem)}
                      >
                        {subItem.title}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          ))}
        </NavbarMenu>
      </Navbar>
    </HeaderWrapper>
  );
};

export { AisNav };
