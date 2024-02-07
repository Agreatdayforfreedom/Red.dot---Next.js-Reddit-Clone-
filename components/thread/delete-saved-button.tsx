"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { deleteSavedThread } from "../../lib/actions";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function DeleteSavedButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await deleteSavedThread(id);
      router.refresh();
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
