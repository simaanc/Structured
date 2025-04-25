// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Structured",
  description: "Generative math patterns with Lindenmayer systems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
