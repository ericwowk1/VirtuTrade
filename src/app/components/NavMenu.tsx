"use client";

import Link from "next/link";

export function NavMenu() {
  return (
    <nav className="max-w-6xl mx-auto px-4 lg:px-8">
      <div className="flex justify-between items-center h-25 bg-white/90 backdrop-blur-sm rounded-xl px-6 shadow-lg">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-black">VirtuTrade</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:block">
          <div className="ml-10 flex items-center space-x-6">
            <Link href="/" className="text-gray-800 hover:text-black px-3 py-2 text-lg font-medium">Home</Link>
            <Link href="/product" className="text-gray-800 hover:text-black px-3 py-2 text-lg font-medium">Portfolio</Link>
            <Link href="/pricing" className="text-gray-800 hover:text-black px-3 py-2 text-lg font-medium">Tournament</Link>
            <Link href="/resources" className="text-gray-800 hover:text-black px-3 py-2 text-lg font-medium">Profile</Link>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/api/auth/signin" className="text-gray-800 hover:text-black px-3 py-2 text-lg font-medium">Log in</Link>
          <Link href="/api/auth/signin" className="bg-black text-white hover:bg-gray-800 px-4 py-1.5 rounded-md text-lg font-medium transition-colors duration-200">Sign up</Link>
        </div>
      </div>
    </nav>
  );
}
