"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import useCurrentUser from "@/hooks/useCurrentUser";
import LoginModal from "./auth/login-modal";

export default function HeaderMainPage() {
  const user = useCurrentUser();
  const [modal, setModal] = useState(false);
  function onClick() {
    setModal(true);
  }

  if (!user) {
    return (
      <div className="flex justify-end my-2 p-2 border-b">
        <LoginModal
          open={modal}
          onClose={() => setModal(false)}
          REDIRECT="/submit"
        />
        <Button onClick={onClick}>New Post</Button>
      </div>
    );
  }
  return (
    <div className="flex justify-end my-2 p-2 border-b">
      <Button>
        <Link href="/submit">New Post</Link>
      </Button>
    </div>
  );
}
