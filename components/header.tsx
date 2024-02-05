import React from "react";
import { IoIosLogOut } from "react-icons/io";
import { auth, signOut } from "@/auth";
import AuthActions from "@/components/auth/auth-actions";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 block w-full h-12 z-50 bg-white border-b  border-slate-600">
      <nav className="flex items-center mx-4 justify-between h-full">
        <Link href={"/"}>Logo</Link>

        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className=""
          >
            <button
              type="submit"
              className="flex items-center space-x-1 hover:text-orange-700"
            >
              <IoIosLogOut size={20} />
              <span>Log out</span>
            </button>
          </form>
        ) : (
          <AuthActions />
        )}
      </nav>
    </header>
  );
}
