"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteSavedThread } from "@/lib/actions";
import { MdClose } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useIntercept } from "@/store/use-intercept";
import axios from "axios";

export default function DeleteSavedButton({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { intercepted } = useIntercept();

  function onClick() {
    startTransition(async () => {
      await deleteSavedThread(id, pathname);
    });
  }

  return (
    <Button
      disabled={isPending}
      onClick={onClick}
      variant={"destructive"}
      className="p-0 rounded-full h-4 w-4"
    >
      <MdClose size={20} />
    </Button>
  );
}
