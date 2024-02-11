"use client";
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ThreadHeader from "@/components/thread/thread-header";
import { Thread } from "@/types";
import ThreadActions from "./thread-actions";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";

interface Props {
  thread: Thread;
}

export default function ThreadPreviewCard({ thread }: Props) {
  const router = useRouter();
  function onNavigate() {
    if (window.getSelection()?.toString()) return; // prevent navigation when select text
    router.push(`/r/programming/thread/${thread.id}`);
  }
  return (
    <Card
      className="hover:border-black p-2 my-5 space-y-2 hover:cursor-pointer w-11/12 mx-auto rounded"
      onClick={onNavigate}
    >
      <CardHeader className="break-all p-1 ">
        <ThreadHeader
          created_at={thread.created_at}
          username={thread.user.name}
        />
        <CardTitle className="text-xl px-2">{thread.title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "p-0",
          thread.content.length > 450 && "transparent-gradient" //show opacity on large texts
        )}
      >
        <p className="pl-4 pt-1 text-sm text-slate-800 max-h-[250px] overflow-hidden z-10">
          {thread.content}
        </p>
      </CardContent>
      <CardFooter className="p-1 pt-0">
        <ThreadActions thread={thread} isFirstAncestor preview />
      </CardFooter>
    </Card>
  );
}
