import React, { Suspense } from "react";
import { IoIosLogOut } from "react-icons/io";

import { signOut } from "@/auth";
import Saved from "@/components/saved";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import UserCard from "./user/user-card";

export default async function PrivateHeader() {
  return <UserCard />;
}
