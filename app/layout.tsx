// src/app/layout.tsx
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Structured - Generative Art App',
  description: 'A generative art application inspired by L-systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}