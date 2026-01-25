"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Home, PieChart, TrendingUp, User, LogOut, Menu, X } from 'lucide-react';
import { TickerSearch } from "./TickerSearch"
import { useState } from "react";

export function NavMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Define routes where nav should be hidden
  const hideNavRoutes = ['/api/auth/signin'];
  
  // Check if current route should hide nav
  const shouldHideNav = hideNavRoutes.includes(pathname);
  
  // Don't render nav on auth pages
  if (shouldHideNav) {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', href: '/', active: pathname === '/' },
    { icon: PieChart, label: 'Portfolio', href: '/portfolio', active: pathname === '/portfolio' },
    { icon: User, label: 'Leaderboard', href: '/leaderboard', active: pathname === '/leaderboard' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Full nav with search bar - always shown
  return (
    <nav className="w-full sticky top-0 z-50 border-b border-slate-800/50 backdrop-blur-xl bg-[#0F172A]/95">
      <div className="flex items-center h-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[1920px] mx-auto">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <div className="h-60 w-60 sm:h-60 sm:w-60 md:h-70 md:w-70 lg:h-45 lg:w-45 xl:w-60 xl:h-60 2xl:h-80 2xl:w-80 transition-transform duration-300 group-hover:scale-105">
            <img 
              src="/logo.png" 
              alt="VirtuTrade Logo"
              className="h-full w-full object-contain drop-shadow-lg" 
            />
          </div>
        </Link>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center  flex-1 ml-12">
          {/* Search Bar */}
          <div className="flex-1 max-w-5xl mr-12">
            <TickerSearch />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                  item.active
                    ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-transform duration-300 ${item.active ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
                <span className="relative z-10">{item.label}</span>
                {item.active && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/20" />
                )}
              </Link>
            ))}

            {/* Divider */}
            <div className="h-6 w-px bg-slate-700/50 mx-2" />

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 ml-2">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-700"
                >
                  <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Sign out</span>
                </button>
              ) : (
                <>
                  <Link
                    href="/api/auth/signin"
                    className="px-4 py-2.5 rounded-lg font-medium text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/api/auth/signin"
                    className="px-5 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden ml-auto p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-700"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
          ) : (
            <Menu className="w-6 h-6 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
          
          {/* Slide-in Menu */}
          <div className="lg:hidden fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-gradient-to-b from-[#0F172A] to-[#1e293b] shadow-2xl border-l border-slate-800/50 transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800/50 bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8">
                    <img 
                      src="/logo.png" 
                      alt="VirtuTrade Logo"
                      className="h-full w-full object-contain" 
                    />
                  </div>
                  <span className="text-white font-semibold text-lg">Menu</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-slate-800/50 bg-slate-900/20">
                <TickerSearch />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                      item.active
                        ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 shadow-lg shadow-cyan-500/10 border border-cyan-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <item.icon className={`w-5 h-5 transition-transform duration-300 ${item.active ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="p-4 border-t border-slate-800/50 bg-slate-900/30 space-y-3">
                {session ? (
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 border border-slate-700 hover:border-slate-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign out</span>
                  </button>
                ) : (
                  <>
                    <Link
                      href="/api/auth/signin"
                      onClick={closeMobileMenu}
                      className="block w-full text-center px-4 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 border border-slate-700 hover:border-slate-600"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/api/auth/signin"
                      onClick={closeMobileMenu}
                      className="block w-full text-center px-4 py-3.5 rounded-xl font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};