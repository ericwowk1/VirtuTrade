"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function NavMenu() {
  const { data: session } = useSession();

  return (
    <nav className="w-full">
      <div className="flex items-center h-[70px] bg-[#101828] px-[90px] shadow-lg">

        {/* Logo - Left side */}
        <img src="/logo.png" alt="Logo" className="pb-3" />

        {/* Search Bar */}
        <div className="flex border-[3px] rounded-sm border-[#d1d5dc] w-1/3 ml-8">
          <input 
            type="text" 
            placeholder="Search Stock Tickers..."
            className="w-full outline-none bg-[#45556c] text-white text-lg px-4 py-3" 
          />
          <button type='button' className="flex items-center justify-center bg-[#314158] px-5 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-white">
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
              </path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-12 ml-auto ">
  <Link href="/" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Home</Link>
  <Link href="/portfolio" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Portfolio</Link>
  <Link href="/market" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Market</Link>
  <Link href="/resources" className="text-white hover:text-gray-300  hover:underline px-3 py-2 text-2xl font-medium">Account</Link>

   {/* Auth Buttons - Push to far right */}
        
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
              <Link href="/api/auth/signin" className="bg-[#45556c] text-white border-[2px] border-[#d1d5dc] px-4 py-1.5 rounded-sm text-xl font-medium hover:underline hover:underline-offset-4 
               cursor-pointer">Log in</Link>
              <Link href="/api/auth/signin" className="bg-[#45556c] text-white border-[2px] border-[#d1d5dc] px-4 py-1.5 rounded-sm text-xl font-medium hover:underline hover:underline-offset-4 
               cursor-pointer">Sign up</Link>
            </>
          )}
</div>

       
        

      </div>
    </nav>
  );
}