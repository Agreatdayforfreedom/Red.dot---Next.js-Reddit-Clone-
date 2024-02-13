import React from "react";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <SessionProvider>
        <main className="mt-12">{children}</main>
      </SessionProvider>
    </>
  );
}
