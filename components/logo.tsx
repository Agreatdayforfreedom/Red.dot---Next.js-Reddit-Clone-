import Link from "next/link";
import React from "react";
import { FaReddit } from "react-icons/fa6";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center space-x-1">
      <FaReddit size={40} fill="#670312" />
      <span className="font-bold text-2xl">Red.dot</span>
    </Link>
  );
}
