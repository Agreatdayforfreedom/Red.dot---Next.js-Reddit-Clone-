import React from "react";
import { signOut } from "@/auth";
import Nav from "@/components/nav";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
