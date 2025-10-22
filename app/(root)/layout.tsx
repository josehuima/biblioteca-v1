import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {  ptPT } from '@clerk/localizations'
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import HeaderWithUserInfo from "@/components/ui/HeaderWithUserInfo";
import Footer from "@/components/parts/Footer";

export const metadata: Metadata = {
  title: {
    template: '%s | Sistema de gestão de biblioteca',
    default: 'Página inicial | Sistema de gestão de biblioteca',
  },
  description: "Sistema de gestão de biblioteca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={ptPT}
      appearance={{
        baseTheme: dark,
        layout: {
          shimmer: true,
          animations: true,
        },
        variables: {
          colorBackground: "#034d18",
        },
      }}
    >
      
        <html lang="pt" suppressHydrationWarning={true}>
          <body cz-shortcut-listen="true">
           
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <HeaderWithUserInfo />
            {children}
          </ThemeProvider>
           <Footer />
          </body>
        </html>
     
    </ClerkProvider>
  );
}
