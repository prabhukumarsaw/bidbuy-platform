// eslint-disable-next-line @typescript-eslint/no-unused-vars

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Search,
  FileText,
  Phone,
  Menu,
  User,
  FileSpreadsheet,
  Briefcase,
  FlaskConical,
  Heart,
  Mail,
  Home,
  Stethoscope,
  Building2,
  GraduationCap,
  PhoneCall,
  ChevronDown,
  CalendarRange,
  LayoutDashboard,
  ArrowRight,
  X,
  Clock,
  Bell,
  Settings,
  LogOut,
  Zap,
  Globe,
  PlusCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LocationSelector } from './LocationSelector';
import { FloatingSearchBar } from './FloatingSearchBar';
import { QuickActions } from './QuickActions';
import { UserNotifications } from './UserNotifications';
import { MegaMenu } from './MegaMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Icons } from './icons';
import { useAuthStore } from '@/lib/store/auth-store';
import { useAuth } from '@/hooks/use-auth';

const topNavItems = [
  { icon: FileText, label: 'Blogs', href: '/blog' },
  { icon: Briefcase, label: 'Career', href: '/career/currentOpenings' },
  { icon: LayoutDashboard, label: 'Support', href: '/support' },
  { icon: PhoneCall, label: 'Documentation', href: '/docs' },
];

const navigationLinks = [
  { icon: Home, title: 'Home', href: '/' },
  {
    icon: Stethoscope,
    title: 'About Us',
    href: '/about/aboutUs',
    children: [
      {
        title: 'About',
        href: '/about/aboutUs',
        description: 'Learn about our commitment to excellence',
      },
      {
        title: 'Gallery',
        href: '/about/gallery',
        description: 'Explore our excellent events and news',
      },
      {
        title: 'Our Policy',
        href: '/about/privacy-policy',
        description: 'Our initiatives to improve community health',
      },
    ],
  },
  {
    icon: Stethoscope,
    title: 'Bidding',
    href: '/bidd',
    children: [
      {
        title: 'Auctions',
        href: '/bidding/auctions',
        description: 'View all current and upcoming auctions',
      },
      {
        title: 'How to Bid',
        href: '/bidding/how-to-bid',
        description: 'Learn the ins and outs of our bidding process',
      },
      {
        title: 'Bidding FAQ',
        href: '/bidding/faq',
        description: 'Find answers to common bidding questions',
      },
    ],
  },
  {
    icon: Stethoscope,
    title: 'Services',
    href: '/services',
    children: [
      {
        title: 'Auction Club',
        href: '/services/auction-club',
        description: 'Join our exclusive Auction Club for premium benefits',
      },
      {
        title: 'Upcoming Auctions',
        href: '/services/upcoming-auctions',
        description: 'Preview our exciting upcoming auction events',
      },
      {
        title: 'Auction Plus',
        href: '/services/auction-plus',
        description: 'Discover our premium auction services',
      },
    ],
  },
  {
    icon: GraduationCap,
    title: 'Contact',
    href: '/contact',
  },
];

const fadeIn = 'transition-opacity duration-300 ease-in-out';
const slideDown = 'transition-all duration-300 ease-in-out transform';

export default function EnhancedHeader() {
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    setIsLoading(true);
    router.push(href);
  };
  React.useEffect(() => {
    const { user, token, refreshToken, isAuthenticated } =
      useAuthStore.getState();
    console.log('Hydrated state:', {
      user,
      token,
      refreshToken,
      isAuthenticated,
    });
  }, []);

  console.log('user', user);
  console.log('isAuthenticated', isAuthenticated);

  return (
    <header className={`bg-background sticky top-0 z-40 w-full ${fadeIn}`}>
      <div className=" mx-auto px-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between py-1 md:gap-x-16 sm:gap-x-0">
            {/* logo name */}
            <Link
              href="/"
              className="flex items-center"
              onClick={() => handleNavigation('/')}
            >
              <Image
                src="/iso.png"
                alt="PROBID Logo"
                width={40}
                height={40}
                className="rounded-full w-12 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-24 lg:h-16" // Updated responsive classes
              />
              <div className="hidden sm:flex flex-col">
                {/* Brand Name */}
                <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl font-extrabold text-primary m-0 lg:mr-8">
                  LazyPro
                </span>
                {/* Tagline */}
                <span className="text-[10px]  text-muted-foreground"></span>
              </div>
            </Link>

            <div className="flex w-full   ">
              <FloatingSearchBar />
            </div>

            <div className="flex items-center  space-x-2 sm:space-x-4">
              <Button className="hidden sm:flex">Become a Supplier</Button>

              <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
                <QuickActions />
                <UserNotifications />
                <Button variant="ghost" onClick={() => router.push('/login')}>
                  <Icons.user className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col h-full">
                    <div className="px-4 py-6 border-b">
                      <Link
                        href="/"
                        className="flex items-center space-x-2"
                        onClick={() => {
                          setIsOpen(false);
                          handleNavigation('/');
                        }}
                      >
                        <Image
                          src="/assets/icons/iso.png"
                          alt="PROBID Logo"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">PROBID</span>
                          <span className="text-xs text-muted-foreground">
                            Bid High, Win Big, Smile Bigger
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-6 px-4">
                      {navigationLinks.map((link) => (
                        <div key={link.title} className="mb-4">
                          {link.children ? (
                            <details className="group">
                              <summary className="flex items-center justify-between cursor-pointer list-none">
                                <span className="flex items-center text-lg font-medium">
                                  <link.icon className="mr-2 h-5 w-5" />
                                  {link.title}
                                </span>
                                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                              </summary>
                              <ul className="mt-2 ml-6 space-y-2">
                                {link.children.map((child) => (
                                  <li key={child.title}>
                                    <Link
                                      href={child.href}
                                      className="block text-sm hover:text-primary transition-colors"
                                      onClick={() => {
                                        setIsOpen(false);
                                        handleNavigation(child.href);
                                      }}
                                    >
                                      {child.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          ) : (
                            <Link
                              href={link.href}
                              className="flex items-center text-lg font-medium hover:text-primary transition-colors"
                              onClick={() => {
                                setIsOpen(false);
                                handleNavigation(link.href);
                              }}
                            >
                              <link.icon className="mr-2 h-5 w-5" />
                              {link.title}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button className="">My Account</Button>
                    <div className="px-4 py-6 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        {topNavItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => {
                              setIsOpen(false);
                              handleNavigation(item.href);
                            }}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
