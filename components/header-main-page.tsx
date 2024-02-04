"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function HeaderMainPage() {
  return (
    <div className="flex justify-end my-2 p-2 border-b">
      <Button>
        <Link href="/thread/new">New Post</Link>
      </Button>
    </div>
  );
}
