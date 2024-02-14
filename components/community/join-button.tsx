"use client";
import React, { useState, useTransition } from "react";
import { Community } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

import axios from "axios";
import CommunityButton from "./button-community";
import { cn } from "@/lib/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import LoginModal from "../auth/login-modal";

export default function JoinButton({
  community,
  className = "",
}: {
  community: Community & { ismember?: boolean };
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [loginModal, setLoginModal] = useState(false);

  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    if (user) {
      startTransition(async () => {
        try {
          await axios.put(`/api/r/${community.id}/join`, null);
          router.refresh();
        } catch (error) {}
      });
    } else {
      setLoginModal(true);
    }
  };
  return (
    <>
      {
        <LoginModal
          open={loginModal}
          onClose={() => setLoginModal(false)}
          REDIRECT={pathname}
        />
      }
      <CommunityButton
        variant={"outline"}
        className={cn("rounded-full px-4 py-0 h-7 bg-transparent", className)}
        onClick={onClick}
        disabled={isPending}
      >
        {community.ismember ? "Leave" : "Join"}
      </CommunityButton>
    </>
  );
}
