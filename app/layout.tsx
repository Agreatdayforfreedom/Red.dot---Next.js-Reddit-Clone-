import type { Metadata } from "next";
import { Inter } from "next/font/google";
import axios from "axios";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddot - Dive into anything",
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
};

axios.defaults.baseURL = "http://localhost:3000";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {modal}
      </body>
    </html>
  );
}
