

import type { Metadata } from 'next';
import ThemeRegistry from './ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Explorer Dashboard',
  description: 'A modern product explorer built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}