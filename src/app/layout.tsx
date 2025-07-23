import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/providers";
import { NavMenu } from "./components/NavMenu";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
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
    <html lang="en" className={inter.variable}>
      <body 
        className="font-sans antialiased relative "
        style={{ backgroundColor: "#0F172A" }}
      >
        <Providers>
          <header className="">
            <NavMenu />
          </header>
          
          <main className="">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}