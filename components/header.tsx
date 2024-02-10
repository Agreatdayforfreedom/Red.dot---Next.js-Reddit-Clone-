import React from "react";
import { auth } from "@/auth";
import AuthActions from "@/components/auth/auth-actions";
import PrivateHeader from "@/components/private-header";
import Logo from "@/components/logo";

export default async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 block w-full h-12 z-50 bg-white border-b  border-slate-600">
      <nav className="flex items-center mx-4 justify-between h-full">
        <Logo />

        {session?.user ? <PrivateHeader /> : <AuthActions />}
      </nav>
    </header>
  );
}
