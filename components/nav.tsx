import React from "react";
import { auth, signOut } from "@/auth";
import AuthActions from "@/components/auth/auth-actions";
import Link from "next/link";

export default async function Nav() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between border-b border-slate-600">
      <Link href={"/"}>Logo</Link>

      {session?.user ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Log out</button>
        </form>
      ) : (
        <AuthActions />
      )}
    </nav>
  );
}
