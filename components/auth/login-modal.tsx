import React from "react";
import LoginForm from "./login-form";

export default function LoginModal({
  open = false,
  REDIRECT,
}: {
  open: boolean;
  REDIRECT: string;
}) {
  if (!open) return undefined;
  return (
    <div className="fixed flex items-center justify-center w-full h-full top-0 left-0 z-50 bg-stone-900/50">
      <div className="w-fit relative">
        <button className="absolute top-1 right-2">X</button>
        <LoginForm REDIRECT={REDIRECT} />
      </div>
    </div>
  );
}
