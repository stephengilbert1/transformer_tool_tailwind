import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transformer Oil Rise Tool",
  description: "Calculate the oil rise for your transformer design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300 flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between shadow-sm">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">
              Transformer Oil Expansion Tool
            </h1>
            <ThemeToggle />
          </header>

          <main className="flex-1 w-full">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
