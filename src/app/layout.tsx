import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/providers";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <Providers>
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
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}