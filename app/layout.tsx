import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HalfCourt Shoe Store Admin',
  description: 'Private store operations and inventory monitoring.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
