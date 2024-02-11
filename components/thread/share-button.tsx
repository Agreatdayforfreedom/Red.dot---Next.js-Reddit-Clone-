"use client";
import { MouseEvent } from "react";
import { Button } from "../ui/button";
import { IoIosShareAlt } from "react-icons/io";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

export default function ShareButton({ currentId }: { currentId: string }) {
  const pathname = usePathname();
  const { toast } = useToast();
  function copy(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    navigator.clipboard.writeText(
      window.location.origin + pathname + "#" + currentId
    );
    toast({
      className: "border-green-700 text-green-700 shadow-none",
      description: "Copied!",
    });
  }
  return (
    <>
      <Button onClick={copy} variant={"link"} className="space-x-1 p-1">
        <IoIosShareAlt size={18} className="mt-1" />
        <span>Share</span>
      </Button>
      <Toaster />
    </>
  );
}
