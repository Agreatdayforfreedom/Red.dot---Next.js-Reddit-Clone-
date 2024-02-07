"use client";
import React from "react";
import { Button } from "../ui/button";
import { deleteSavedThread } from "../../lib/actions";
import { MdClose } from "react-icons/md";

export default function DeleteSavedButton({ id }: { id: string }) {
  async function onClick() {
    await deleteSavedThread(id);
  }

  return (
    <Button
      onClick={onClick}
      variant={"destructive"}
      className="p-0 rounded-full h-4 w-4"
    >
      <MdClose size={20} />
    </Button>
  );
}
