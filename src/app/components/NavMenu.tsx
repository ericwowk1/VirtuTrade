"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, PieChart, TrendingUp, User, LogOut } from 'lucide-react';
import { TickerSearch } from "./TickerSearch"

export function NavMenu() {
  const { data: session } = useSession();

  return (
    <nav className="w-full">
      <div className="flex items-center h-[50px] bg-[#101828] px-[90px] shadow-lg">

        {/* Logo - Left side */}
        <img src="/logo.png" alt="Logo" className="pb-3" />

        {/* Search Bar in its own component to add autocomplete functionality cleanly */}
         <TickerSearch />

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 ml-auto">
          {[
            { icon: Home, label: 'Home', href: '/', active: true },
            { icon: PieChart, label: 'Portfolio', href: '/portfolio' },
            { icon: TrendingUp, label: 'Market', href: '/market' },
            { icon: User, label: 'Account', href: '/resources' },
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
                className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/api/auth/signin" 
                  className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                >
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
                <Link 
                  href="/api/auth/signin" 
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
                >
                  <span className="text-sm font-medium">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}