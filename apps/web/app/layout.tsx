import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Engine Workshop",
  description:
    "Turn-based game engine — workshop bootstrap for AI Generation in practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
