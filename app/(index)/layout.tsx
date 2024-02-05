import React from "react";
import { signOut } from "@/auth";
import Header from "@/components/header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="mt-12">{children}</main>
    </>
  );
}
