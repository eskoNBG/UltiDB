import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UltimateDB - Awesome Lists Knowledge Hub",
  description: "Discover, search, and explore 500+ curated awesome lists from GitHub. Your centralized hub for developer resources.",
  keywords: ["awesome lists", "GitHub", "developer resources", "curated lists", "programming", "open source"],
  authors: [{ name: "UltimateDB Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "UltimateDB - Awesome Lists Knowledge Hub",
    description: "Discover, search, and explore 500+ curated awesome lists from GitHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UltimateDB - Awesome Lists Knowledge Hub",
    description: "Discover, search, and explore 500+ curated awesome lists from GitHub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
