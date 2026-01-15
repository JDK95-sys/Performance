import type { Metadata } from 'next';
import './globals.css';

// Use system fonts as fallback if Google Fonts is not available
const fontClass = 'font-sans';

export const metadata: Metadata = {
  title: 'PerformPro - AI-Powered Performance Management',
  description: 'Comprehensive AI-enabled performance management system for 14K+ employees with reviews, goals, feedback, and talent analytics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontClass}>{children}</body>
    </html>
  );
}
