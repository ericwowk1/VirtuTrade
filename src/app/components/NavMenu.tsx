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

if (pathname == '/' && !session) {
    return (
    <nav className="w-full">
      <div className="flex items-center justify-between h-[60px] bg-[#101828] shadow-lg px-4 sm:px-8 lg:px-12 xl:px-24 2xl:px-42">
        
        {/* Logo */}
        <div className="h-60 w-60 sm:h-60 sm:w-60 md:h-70 md:w-70 lg:h-80 lg:w-80  xl:w-90 xl:h-90 2xl:h-90">
          <img 
            src="/logo.png" 
            alt="VirtuTrade Logo"
            className="h-full w-full object-contain" 
          />
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden lg:flex">
          <Link
            href="/api/auth/signin"
            className="flex items-center justify-center space-x-2 w-[10rem] px-4 py-3 bg-gradient-to-r from-cyan-900 to-cyan-600 text-white font-medium rounded-md shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200"
          >
            <span className="text-md font-medium">Get Started</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white bg-opacity-10 backdrop-blur-sm" onClick={closeMobileMenu}>
          <div className="fixed inset-y-0 right-0 w-64 bg-[#101828] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <span className="text-white font-semibold">Menu</span>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Auth Button */}
              <div className="p-4 border-b border-slate-700">
                <Link
                  href="/api/auth/signin"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-cyan-900 to-cyan-600 text-white font-medium rounded-md shadow-lg hover:opacity-90 transition-all duration-200"
                >
                  <span className="text-sm font-medium">Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

if (pathname == '/' && session) {
  return (
    <nav className="w-full">
      <div className="flex items-center h-[60px] bg-[#101828] shadow-lg px-4 sm:px-8 lg:px-8 xl:px-24 2xl:px-42">
        
        {/* Logo */}
        <div className="h-60 w-60 sm:h-60 sm:w-60 md:h-70 md:w-70 lg:h-45 lg:w-45  xl:w-60 xl:h-60 2xl:h-80  2xl:w-80">
          <img 
            src="/logo.png" 
            alt="VirtuTrade Logo"
            className="h-full w-full object-contain" 
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between flex-1 ">
          {/* Search Bar */}
          <TickerSearch />

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 lg:pl-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4 lg:w-4 lg:h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="ml-4">
              <button
                onClick={() => signOut()}
                className="flex items-center w-30 space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <div className="text-sm font-medium">Sign out</div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white bg-opacity-10 backdrop-blur-sm" onClick={closeMobileMenu}>
          <div className="fixed inset-y-0 right-0 w-64 bg-[#101828] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <span className="text-white font-semibold">Navigation</span>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-slate-700 w-[35rem]">
                <TickerSearch />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 p-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        item.active
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Sign Out */}
              <div className="p-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="flex items-center w-full space-x-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

 return (
  <div>
    <nav className="w-full">
      <div className="flex items-center h-[60px] bg-[#101828] shadow-lg px-4 sm:px-8 lg:px-12 xl:px-24 2xl:px-42">
        
        {/* Logo */}
        <div className="h-60 w-60 sm:h-55 sm:w-50 lg:h-30 lg:w-30 xl:h-80 xl:w-80">
          <img 
            src="/logo.png" 
            alt="VirtuTrade Logo"
            className="h-full w-full object-contain" 
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between flex-1 ">
          {/* Search Bar */}
          <TickerSearch />

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-2 px-2 py-2 rounded-lg transition-all duration-200 ${
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={closeMobileMenu}>
          <div className="fixed inset-y-0 right-0 w-64 bg-[#101828] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <span className="text-white font-semibold">Navigation</span>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-slate-700 w-[30rem]">
                <TickerSearch />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 p-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        item.active
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Section */}
              <div className="p-4 border-t border-slate-700">
                {session ? (
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="flex items-center w-full space-x-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center w-full px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                    >
                      <span className="text-sm font-medium">Sign In</span>
                    </Link>
                    <Link
                      href="/auth"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center w-full px-3 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
                    >
                      <span className="text-sm font-medium">Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  </div>
)};