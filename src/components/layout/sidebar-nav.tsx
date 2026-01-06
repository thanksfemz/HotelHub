'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck2,
  Users,
  CreditCard,
  UserCog,
  Sparkles,
  BarChart3,
  Settings,
  User,
  LogOut,
  PanelLeft,
} from 'lucide-react';
import { useSidebar } from './sidebar-provider';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from '../logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { authService } from '@/lib/services/authService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'staff'] },
  { href: '/rooms', icon: BedDouble, label: 'Rooms', roles: ['admin', 'manager', 'staff'] },
  { href: '/bookings', icon: CalendarCheck2, label: 'Bookings', roles: ['admin', 'manager', 'staff'] },
  { href: '/guests', icon: Users, label: 'Guests', roles: ['admin', 'manager', 'staff'] },
  { href: '/payments', icon: CreditCard, label: 'Payments', roles: ['admin', 'manager'] },
  { href: '/staff', icon: UserCog, label: 'Staff', roles: ['admin'] },
  { href: '/services', icon: Sparkles, label: 'Services', roles: ['admin', 'manager'] },
  { href: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager'] },
];

const settingsNav = {
  href: '/settings',
  icon: Settings,
  label: 'Settings',
  roles: ['admin'],
};

function NavItem({ href, icon: Icon, label, isCollapsed }: any) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn('w-full justify-start', isCollapsed && 'justify-center')}
      >
        <Icon className={cn('mr-2 h-4 w-4', isCollapsed && 'mr-0')} />
        {!isCollapsed && label}
      </Button>
    </Link>
  );
}

function UserMenu() {
    const { user, clearAuth } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authService.logout();
            clearAuth();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.email ? `https://avatar.vercel.sh/${user.email}.png` : undefined} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                </DropdownMenuItem>
                 {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                        <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function MainNav({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuthStore();
  const userRole = user?.role || 'staff';

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));
  const showSettings = settingsNav.roles.includes(userRole);
  
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center p-4", isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && <Logo />}
      </div>
      <nav className="flex-1 space-y-2 px-2">
        {filteredNavItems.map((item) => (
          <NavItem key={item.href} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      <div className="mt-auto space-y-2 p-2">
        {showSettings && <NavItem {...settingsNav} isCollapsed={isCollapsed} />}
      </div>
    </div>
  );
}

export function SidebarNav() {
  const { open: isSidebarOpen, isMobile, toggleSidebar } = useSidebar();
  const isCollapsed = isMobile ? false : !isSidebarOpen;

  if (isMobile) {
    return (
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet open={isMobile && !isSidebarOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <PanelLeft className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-72">
            <MainNav isCollapsed={false} />
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          {/* Add mobile header content here if needed, like a search bar */}
        </div>
        <UserMenu />
      </header>
    );
  }

  return (
    <div
      className={cn(
        'hidden border-r bg-muted/40 md:block transition-all duration-300',
        isSidebarOpen ? 'w-72' : 'w-20'
      )}
    >
      <div className="relative h-full">
         <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-4 top-4 z-10"
            onClick={toggleSidebar}
          >
            <PanelLeft className={cn("h-4 w-4 transition-transform", isSidebarOpen && "rotate-180")} />
          </Button>
        <MainNav isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}

export function HeaderNav() {
    const { isMobile, isSidebarOpen, toggleSidebar } = useSidebar();

    if (isMobile) {
      return (
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet open={!isSidebarOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <PanelLeft className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-72">
            <MainNav isCollapsed={false} />
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          {/* Add mobile header content here if needed, like a search bar */}
        </div>
        <UserMenu />
      </header>
      )
    }

    return (
        <header className="flex h-14 items-center justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <UserMenu />
        </header>
    );
}