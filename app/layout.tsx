// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MetaMetrics AI | Meta Ads Explained in Plain English',
  description:
    'Stop staring at spreadsheets. Upload your Meta Ads CSV export and let AI tell you exactly which ads to scale and which to kill.',
  keywords: ['Meta Ads', 'Facebook Ads', 'AI Analysis', 'Ad Performance', 'ROAS', 'Small Business'],
  openGraph: {
    title: 'MetaMetrics AI',
    description: 'Your Meta Ads, explained in plain English.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}