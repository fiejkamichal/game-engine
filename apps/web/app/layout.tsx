import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { LanguageToggle } from "./_components/language-toggle";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

// Inline-injected przed paint. Wyciąga wybór motywu z localStorage i ustawia
// data-theme na <html> ZANIM React zdąży zrenderować body. Inaczej light
// theme dawałby flash dark → light przy pierwszej wizycie.
const themeBootstrap = `try{var t=localStorage.getItem("app-theme")||"dark";if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div id="app-root">{children}</div>
          <div className="toolbar">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
