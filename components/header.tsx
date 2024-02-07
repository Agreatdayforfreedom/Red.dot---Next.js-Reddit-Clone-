import React from "react";
import { auth } from "@/auth";
import AuthActions from "@/components/auth/auth-actions";
import Link from "next/link";
import PrivateHeader from "./private-header";

export default async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 block w-full h-12 z-50 bg-white border-b  border-slate-600">
      <nav className="flex items-center mx-4 justify-between h-full">
        <Link href={"/"}>Logo</Link>

        {session?.user ? <PrivateHeader /> : <AuthActions />}
      </nav>
    </header>
  );
}
