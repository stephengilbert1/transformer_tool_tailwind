import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
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
    <html lang="en" className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
