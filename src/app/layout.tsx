import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/providers";
import { getServerSession } from "next-auth";
import { NavMenu } from "./components/NavMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paper Trading App",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* Background image that stays below everything */}
        <div 
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/background.jpg')" }}
          aria-hidden="true"
        />
        
        {/* Navigation */}
        <header className="w-full py-4 relative z-10">
          <NavMenu />
        </header>
        
        {/* Main content */}
        <main className="relative z-0">
           
        </main>
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
        
      </body>
    </html>
  );
}