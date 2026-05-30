import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeToggle } from "./_components/theme-toggle";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Game Engine Workshop",
  description:
    "Turn-based game engine — workshop bootstrap for AI Generation in practice.",
};

// Inline-injected przed paint. Wyciąga wybór motywu z localStorage i ustawia
// data-theme na <html> ZANIM React zdąży zrenderować body. Inaczej light
// theme dawałby flash dark → light przy pierwszej wizycie.
const themeBootstrap = `try{var t=localStorage.getItem("app-theme")||"dark";if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen antialiased">
        <div id="app-root">{children}</div>
        <div className="toolbar">
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
