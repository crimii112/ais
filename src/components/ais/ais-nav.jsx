import { Link } from 'react-router-dom';
import { useAisNav } from '@/context/AisNavContext';
import {
  HeaderWrapper,
  Logo,
  Navbar,
  NavbarMenu,
} from '@/components/ui/navbar';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

const data = {
  navItems: [
    {
      id: 0,
      title: '일반 대기질 데이터 분석',
      subItems: [
        {
          pathName: 'cmmnAir',
          title: '일반대기 검색',
          content: '',
        },
        {
          pathName: 'nav1-sub2',
          title: 'nav1-sub2',
          content: '',
        },
        {
          pathName: 'nav1-sub3',
          title: 'nav1-sub3',
          content: '',
        },
      ],
    },
    {
      id: 1,
      title: 'Nav2',
      subItems: [
        {
          pathName: 'nav2-sub1',
          title: 'nav2-sub1',
          content: '',
        },
        {
          pathName: 'nav2-sub2',
          title: 'nav2-sub2',
          content: '',
        },
        {
          pathName: 'nav2-sub3',
          title: 'nav2-sub3',
          content: '',
        },
      ],
    },
    {
      id: 2,
      title: 'Nav3',
      subItems: [
        {
          pathName: 'nav3-sub1',
          title: 'nav3-sub1',
          content: '',
        },
        {
          pathName: 'nav3-sub2',
          title: 'nav3-sub2',
          content: '',
        },
        {
          pathName: 'nav3-sub3',
          title: 'nav3-sub3',
          content: '',
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
                className="flex items-center gap-1 px-4 py-2 rounded-md text-lg"
              >
                {item.title}
                <ChevronDown size={16} />
              </MenuButton>
              <MenuItems
                as="ul"
                className="absolute gap-2 left-1/2 transform -translate-x-1/2 z-50 p-4 flex flex-col bg-amber-100"
              >
                {item.subItems.map(subItem => (
                  <MenuItem key={subItem.pathName}>
                    <button
                      className={`px-4 py-1 whitespace-nowrap text-center w-full hover:bg-amber-200`}
                      onClick={() => setTabList([...tabList, subItem])}
                    >
                      {subItem.title}
                    </button>
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
