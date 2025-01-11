import React from 'react';
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Black or Red",
  description: "A modern card game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={`${inter.className} bg-gradient-to-br from-[#8e0e00] to-[#1f1c18] min-h-screen font-poppins`}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
