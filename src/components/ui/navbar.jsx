import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

const HeaderWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('flex flex-row w-full h-18 items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
};
HeaderWrapper.displayName = 'HeaderWrapper';

const Logo = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('flex items-center justify-center h-full px-7', className)}
      {...props}
    >
      {children}
    </div>
  );
};
Logo.displayName = 'Logo';

const Navbar = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-row h-full', className)} {...props}>
      {children}
    </div>
  );
};
Navbar.displayName = 'Navbar';

const NavbarMenu = ({ className, children, ...props }) => {
  return (
    <ul
      className={cn('flex flex-row items-center justify-center', className)}
      {...props}
    >
      {children}
    </ul>
  );
};
NavbarMenu.displayName = 'NavbarMenu';

const NavbarMenuItem = ({ className, children, ...props }) => {
  return (
    <li className={cn('mx-12 text-lg', className)} {...props}>
      {children}
    </li>
  );
};
NavbarMenuItem.displayName = 'NavbarMenuItem';

const NavbarMenuItemButton = ({ asChild, className, children, ...props }) => {
  const Component = asChild ? Slot : 'button';

  return (
    <Component className={cn('', className)} {...props}>
      {children}
    </Component>
  );
};
NavbarMenuItemButton.displayName = 'NavbarMenuItemButton';

export {
  HeaderWrapper,
  Logo,
  Navbar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuItemButton,
};
