"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Home, PieChart, TrendingUp, User, LogOut } from 'lucide-react';
import { TickerSearch } from "./TickerSearch"

export function NavMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Define routes where nav should be hidden
  const hideNavRoutes = ['/api/auth/signin'];
  
  // Check if current route should hide nav
  const shouldHideNav = hideNavRoutes.includes(pathname);
  
  // Don't render nav on auth pages
  if (shouldHideNav) {
    return null;
  }

if (pathname == '/') {
    return (
    <nav className="w-full ">
      <div className="flex items-center justify-between h-[60px] bg-[#101828] shadow-lg px-8 sm:px-12 md:px-24 lg:px-42">
        
        {/* Logo - At the very start */}
        <div className="h-80 w-80 ">
          <img 
            src="/logo.png" 
            alt="An example image"
            className="h-full w-full" 
          />
        </div>
        

        {/* Auth Buttons - Moved to the end */}
        <div className="hidden md:flex">
          {session ? (
            <button
              onClick={() => signOut()}
              className="flex w-30 space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <div className="text-sm font-medium">Sign out</div>
            </button>
          ) : (
            <div className="flex space-x-2">
              
              <Link
  href="/auth"
  className="flex items-center justify-center space-x-2 w-[10rem] px-4 py-3 bg-gradient-to-r from-cyan-900 to-cyan-600 text-white font-medium rounded-full shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200"
>
  <span className="text-md font-medium">Get Started</span>
</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

  return (
    <nav className="w-full ">
      <div className="flex items-center h-[60px] bg-[#101828] shadow-lg px-8 sm:px-12 md:px-24 lg:px-42">
        
        {/* Logo - At the very start */}
        <div className="h-65 w-65 ">
          <img 
            src="/logo.png" 
            alt="An example image"
            className="h-full w-full" 
          />
        </div>

        {/* Main content area with original padding */}
        <div className="flex items-center justify-between flex-1">
          
          {/* Search Bar */}
          <TickerSearch />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {[
              { icon: Home, label: 'Home', href: '/', active: pathname === '/' },
              { icon: PieChart, label: 'Portfolio', href: '/portfolio', active: pathname === '/portfolio' },
              { icon: TrendingUp, label: 'Market', href: '/market', active: pathname === '/market' },
              { icon: User, label: 'Leaderboard', href: '/leaderboard', active: pathname === '/leaderboard' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="ml-4">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-30 space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <div className="text-sm font-medium">Sign out</div>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth"
                    className="flex space-x-2 w-20 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                  >
                    <span className="text-sm font-medium">Sign In</span>
                  </Link>
                  <Link
                    href="/auth"
                    className="flex items-center space-x-2 w-20 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
                  >
                    <span className="text-sm font-medium">Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}