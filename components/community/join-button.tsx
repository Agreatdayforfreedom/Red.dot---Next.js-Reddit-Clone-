"use client";
import React, { useTransition } from "react";
import { Community } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import axios from "axios";

export default function JoinButton({
  community,
}: {
  community: Community & { ismember: boolean };
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onClick = () => {
    startTransition(async () => {
      try {
        await axios.put(`/api/r/${community.id}/join`, null);
      } catch (error) {}
      router.refresh();
    });
  };
  return (
    <Button
      variant={"outline"}
      className="rounded-full px-4 py-0 h-7 bg-transparent"
      onClick={onClick}
      disabled={isPending}
      style={{
        borderColor: community.interactive_elements_color,
        color: community.interactive_elements_color,
      }}
    >
      {community.ismember ? "Leave" : "Join"}
    </Button>
  );
}
