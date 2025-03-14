import { Link } from 'react-router-dom';
import {
  HeaderWrapper,
  Logo,
  Navbar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuItemButton,
} from './ui/navbar';

const data = {
  navItems: [
    {
      id: 'home',
      title: '홈',
      url: '/',
    },
    {
      id: 'ais',
      title: '대기측정망 자료관리',
      url: '/ais',
    },
    {
      id: 'contact',
      title: 'Contact',
      url: '/contact',
    },
  ],
};

function MainNav() {
  return (
    <HeaderWrapper>
      <Logo>
        <span className="text-2xl">
          <Link to="/">과학원</Link>
        </span>
      </Logo>
      <Navbar>
        <NavbarMenu>
          {data.navItems.map(item => (
            <NavbarMenuItem key={item.id}>
              <NavbarMenuItemButton>
                <Link to={item.url}>{item.title}</Link>
              </NavbarMenuItemButton>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </HeaderWrapper>
  );
}

export default MainNav;
