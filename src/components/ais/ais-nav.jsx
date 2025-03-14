import { Link } from 'react-router-dom';
import {
  HeaderWrapper,
  Logo,
  Navbar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuItemButton,
} from '@/components/ui/navbar';

const data = {
  navItems: [
    {
      id: 0,
      title: '일반 대기질 데이터 분석',
      subItems: [
        {
          pathName: 'cmmnAir',
          title: '일반대기 검색',
        },
        {
          pathName: 'nav1-sub2',
          title: 'nav1-sub2',
        },
        {
          pathName: 'nav1-sub3',
          title: 'nav1-sub3',
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
        },
        {
          pathName: 'nav2-sub2',
          title: 'nav2-sub2',
        },
        {
          pathName: 'nav2-sub3',
          title: 'nav2-sub3',
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
        },
        {
          pathName: 'nav3-sub2',
          title: 'nav3-sub2',
        },
        {
          pathName: 'nav3-sub3',
          title: 'nav3-sub3',
        },
      ],
    },
  ],
};

function AisNav() {
  return (
    <HeaderWrapper>
      <Logo>
        <span className="text-2xl">
          <Link to="/ais">대기측정망 자료관리 시스템</Link>
        </span>
      </Logo>
      <Navbar>
        <NavbarMenu>
          {data.navItems.map(item => (
            <NavbarMenuItem key={item.id}>
              <NavbarMenuItemButton>{item.title}</NavbarMenuItemButton>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </HeaderWrapper>
  );
}

export default AisNav;
