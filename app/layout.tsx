import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/lib/init-db';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Internal Job Marketplace - Talent Mobility Platform',
  description: 'AI-powered internal job marketplace for talent mobility and career development',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
