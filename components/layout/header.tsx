'use client';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
export default function Header() {
  const logoClickHandler = () => {
    const userLoggedIn = localStorage.getItem('user') ? true : false;
    if (typeof window !== 'undefined') {
      if (userLoggedIn) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/home';
      }
    }
  };
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          {/* <svg viewBox="0 0 50 50" className="mr-2 h-9 w-9"> */}
          <Image
            src="https://brew-master-dev.s3.us-east-2.amazonaws.com/FundoTrasnparenteLogo.png"
            height="50"
            width="50"
            alt="company logo"
            onClick={() => logoClickHandler()}
          />
          {/* </svg> */}
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />

          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
