import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <main className="h-full">
      <div className="fixed top-0 bg-gradient-to-r from-slate-800 via-slate-500 to-slate-900 h-2 w-full"></div>
      {children}
    </main>
  );
}
