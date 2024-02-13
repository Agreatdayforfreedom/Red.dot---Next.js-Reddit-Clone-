"use client";
import React, { useTransition } from "react";
import { Community } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

import axios from "axios";
import CommunityButton from "./button-community";
import { cn } from "@/lib/utils";

export default function JoinButton({
  community,
  className = "",
}: {
  community: Community & { ismember?: boolean };
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onClick = () => {
    startTransition(async () => {
      try {
        await axios.put(`/api/r/${community.id}/join`, null);
        router.refresh();
      } catch (error) {}
    });
  };
  return (
    <CommunityButton
      variant={"outline"}
      className={cn("rounded-full px-4 py-0 h-7 bg-transparent", className)}
      onClick={onClick}
      disabled={isPending}
    >
      {community.ismember ? "Leave" : "Join"}
    </CommunityButton>
  );
}
