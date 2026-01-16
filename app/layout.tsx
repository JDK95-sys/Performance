import type { Metadata } from 'next';
import './globals.css';

// Note: Google Fonts removed to support restricted build environments
// Using system fonts as fallback via Tailwind config

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
