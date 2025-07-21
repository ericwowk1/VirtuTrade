"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, PieChart, TrendingUp, User, LogOut } from 'lucide-react';
import { TickerSearch } from "./TickerSearch"

export function NavMenu() {
  const { data: session } = useSession();

  return (
    <nav className="w-full">
      <div className="flex items-center h-[60px] bg-[#101828] shadow-lg">
        
        {/* Logo - At the very start */}
        

        <div className="h-65 w-65 ">
  <img 
    src="/logo.png" 
    alt="An example image"
    className="h-full w-full" 
  />
</div>

        {/* Main content area with original padding */}
        <div className="flex items-center justify-between flex-1 px-[90px]">
          
          {/* Search Bar */}
          <TickerSearch />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {[
              { icon: Home, label: 'Home', href: '/', active: true },
              { icon: PieChart, label: 'Portfolio', href: '/portfolio' },
              { icon: TrendingUp, label: 'Market', href: '/market' },
              { icon: User, label: 'Leaderboard', href: '/leaderboard' },
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
                    href="/api/auth/signin"
                    className="flex space-x-2 w-20 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                  >
                    <span className="text-sm font-medium">Sign In</span>
                  </Link>
                  <Link
                    href="/api/auth/signin"
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