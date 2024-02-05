"use client";
import { useSession } from "next-auth/react";
import React from "react";

export default function Test() {
  const sess = useSession();
  return <div>{JSON.stringify(sess)}</div>;
}
