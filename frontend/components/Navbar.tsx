'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  Globe,
  Heart,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { LocationSelector } from './LocationSelector';
import { SearchDialog } from './search-dialog';
import { UserNotifications } from './UserNotifications';
import { useAuthStore } from '@/lib/store/auth-store';
import { useAuth } from '@/hooks/use-auth';
import { Icons } from './icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navigationItems = [
  {
    title: 'Explore',
    items: [
      {
        title: 'Featured Auctions',
        href: '/auctions/featured',
        description: 'Browse our most popular and trending auctions',
      },
      {
        title: 'Live Auctions',
        href: '/auctions/live',
        description: 'Join ongoing live auction events',
      },
      {
        title: 'Coming Soon',
        href: '/auctions/upcoming',
        description: 'Preview upcoming auction events',
      },
    ],
  },
  {
    title: 'Services',
    href: '/services',
  },
  {
    title: 'Need Help ?',
    href: '/help',
  },
  {
    title: 'Auction',
    href: '/auction',
    badge: 'PRO',
  },
];

const mobileMenuItems = [
  { title: 'Home', href: '/' },
  { title: 'Discover', href: '/discover' },
  { title: 'Jobs', href: '/jobs' },
  { title: 'Premium', href: '/premium', badge: 'PRO' },
  { title: 'Live Auctions', href: '/live' },
  { title: 'Following', href: '/following' },
];

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToDashboard = () => {
    const routes = {
      USER: '/user',
      SELLER: '/seller',
      ADMIN: '/admin',
    };
    if (user?.role) {
      router.push(routes[user.role]);
    } else {
      router.push('/');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-4 shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="grid gap-6 p-6">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <span className="font-bold">AuctionHub</span>
                </Link>
              </div>
              <LocationSelector />
              <nav className="grid gap-4">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between text-base transition-colors hover:text-primary',
                      pathname === item.href && 'font-medium text-primary'
                    )}
                  >
                    {item.title}
                    {item.badge && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              <div className="grid gap-4 border-t pt-6">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Help
                </Link>
              </div>
              {isAuthenticated ? (
                <div className="px-4 py-6 border-t">
                  <Button
                    className="w-full mb-2"
                    onClick={() => router.push('/profile')}
                  >
                    My Account
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-6 border-t">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className=" flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">AuctionHub</span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end ">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subItem.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href || '#'} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.title}
                        {item.badge && (
                          <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex w-full items-center gap-2 md:w-auto ">
            <LocationSelector />

            <Button
              variant="ghost"
              className="flex-1 justify-start text-base md:w-[260px]"
              onClick={() => setShowSearch(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="text-muted-foreground">Search...</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorites</span>
            </Button>

            <UserNotifications />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={user?.image || ''}
                        alt={user?.name || 'User avatar'}
                      />
                      <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 hidden md:inline-block">
                      {user?.name}
                    </span>
                    <ChevronDown className="h-4 w-4 hidden md:inline-block" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Profile Navigation */}
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>

                  {/* Role-Based Dashboard Navigation */}
                  <DropdownMenuItem onClick={navigateToDashboard}>
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Logout Action */}
                  <DropdownMenuItem onClick={handleLogout}>
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => router.push('/login')}>
                {/* <User className="w-4 h-4 mr-2" /> */}
                Login
              </Button>
            )}
            {isAuthenticated && user?.role === 'USER' && (
              <Button
                className="hidden sm:flex"
                onClick={() => router.push('/become-seller')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Become a Seller
              </Button>
            )}
          </div>
        </div>
      </div>
      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </header>
  );
}
