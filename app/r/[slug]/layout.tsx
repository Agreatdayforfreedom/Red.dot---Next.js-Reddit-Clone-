import React from "react";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
  modal: React.ReactNode;
  team: React.ReactNode;
}

export default function Layout({ children, modal }: Props) {
  return (
    <>
      <Header />
      <SessionProvider>
        <main className="mt-12">
          {modal}
          {children}
        </main>
      </SessionProvider>
    </>
  );
}
