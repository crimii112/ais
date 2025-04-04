import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

import { useAisNav } from '@/context/AisNavContext';
import {
  HeaderWrapper,
  Logo,
  Navbar,
  NavbarMenu,
} from '@/components/ui/navbar';
import { CmmnAir } from './contents/cmmnair';
import { PhotoCh } from './contents/photoch';

const data = {
  navItems: [
    {
      id: 0,
      title: '일반 대기질 데이터 분석',
      subItems: [
        {
          heading: '일반 대기질 데이터 분석',
          pathName: 'cmmnAir',
          title: '일반대기 검색',
          content: <CmmnAir />,
        },
        {
          heading: '일반 대기질 데이터 분석',
          pathName: 'nav1-sub2',
          title: 'nav1-sub2',
          content: 'nav1-sub2',
        },
        {
          heading: '일반 대기질 데이터 분석',
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
          heading: '특수 대기질 테이터 분석',
          pathName: 'photoCh',
          title: '광화학 데이터 그래프',
          content: <PhotoCh chartType="line" />,
        },
        {
          heading: '특수 대기질 테이터 분석',
          pathName: 'photoChPie',
          title: '광화학 성분 파이그래프',
          content: <PhotoCh chartType="pie" />,
        },
        {
          heading: '특수 대기질 테이터 분석',
          pathName: 'photoChBar',
          title: '광화학 성분 막대그래프',
          content: <PhotoCh chartType="bar" />,
        },
      ],
    },
    {
      id: 2,
      title: 'Nav3',
      subItems: [
        {
          heading: 'Nav3',
          pathName: 'nav3-sub1',
          title: 'nav3-sub1',
          content: 'nav3-sub1',
        },
        {
          heading: 'Nav3',
          pathName: 'nav3-sub2',
          title: 'nav3-sub2',
          content: 'nav3-sub2',
        },
        {
          heading: 'Nav3',
          pathName: 'nav3-sub3',
          title: 'nav3-sub3',
          content: 'nav3-sub3',
        },
      ],
    },
  ],
};

const AisNav = () => {
  const { tabList, setTabList } = useAisNav();

  return (
    <HeaderWrapper>
      <Logo>
        <span className="text-2xl">
          <Link to="/ais">대기측정망 자료관리 시스템</Link>
        </span>
      </Logo>
      <Navbar>
        <NavbarMenu className="gap-8">
          {data.navItems.map(item => (
            <Menu as="div" key={item.id} className="relative">
              <MenuButton
                as="button"
                className="flex items-center gap-1 px-4 py-2 rounded-md text-lg cursor-pointer"
              >
                {item.title}
                <ChevronDown size={16} />
              </MenuButton>
              <MenuItems className="absolute gap-2 left-1/2 transform -translate-x-1/2 z-50 shadow-lg p-4 flex flex-col bg-white rounded-md border-2">
                {item.subItems.map(subItem => (
                  <MenuItem key={subItem.pathName}>
                    {({ active }) => (
                      <button
                        className={`px-4 py-1 whitespace-nowrap text-center w-full cursor-pointer ${
                          active ? 'bg-blue-900 text-white' : ''
                        }`}
                        onClick={() => setTabList([...tabList, subItem])}
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
