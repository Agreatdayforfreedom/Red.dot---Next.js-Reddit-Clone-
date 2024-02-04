import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

export default async function AuthActions() {
  return (
    <div>
      <Button variant={"ghost"} className="m-1">
        <Link href="/register">Sign up</Link>
      </Button>
      <Button variant={"default"} className="m-1">
        <Link href="/login">Log in</Link>
      </Button>
    </div>
  );
}
