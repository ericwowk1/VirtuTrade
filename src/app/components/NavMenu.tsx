"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { TickerSearch } from "./TickerSearch"

export function NavMenu() {
  const { data: session } = useSession();

  return (
    <nav className="w-full">
      <div className="flex items-center h-[70px] bg-[#101828] px-[90px] shadow-lg">

        {/* Logo - Left side */}
        <img src="/logo.png" alt="Logo" className="pb-3" />

        {/* Search Bar in its own component to add autocomplete functionality cleanly */}
         <TickerSearch />

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-12 ml-auto ">
  <Link href="/" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Home</Link>
  <Link href="/portfolio" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Portfolio</Link>
  <Link href="/market" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Market</Link>
  <Link href="/resources" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Account</Link>



   {/* Auth Buttons - Push to far right */}
        <div>
          {session ? (
            <button 
              onClick={() => signOut()}
              className="bg-[#45556c] text-white border-[2px] border-[#d1d5dc] px-4 py-1.5 rounded-sm text-xl font-medium hover:underline hover:underline-offset-4 
               cursor-pointer"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/api/auth/signin" className="text-[#2b7fff] px-8 py-2 rounded-lg text-xl font-medium hover:from-gray-100 hover:to-[#3a4654] cursor-pointer">Sign In</Link>
              <Link href="/api/auth/signin" className="bg-[#155dfc] text-white px-8 py-3 rounded-md text-xl cursor-pointer">
              Sign Up
              </Link>
            </>
          )}
          </div>
</div>


       
        

      </div>
    </nav>
  );
}