"use client";
import React from "react";
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

interface Props {
  thread: Thread;
}

export default function ThreadPreviewCard({ thread }: Props) {
  const router = useRouter();
  // {`/thread/${thread.id}`}
  function onNavigate() {
    if (window.getSelection()?.toString()) return; // prevent navigation when select text
    router.push(`/thread/${thread.id}`);
  }

  return (
    <Card
      className="hover:border-black hover:cursor-pointer w-4/5 mx-auto"
      onClick={onNavigate}
    >
      <CardHeader className="break-all">
        <ThreadHeader
          created_at={thread.created_at}
          username={thread.user.name}
        />
        <CardTitle className="text-xl">{thread.title}</CardTitle>
      </CardHeader>
      <CardContent className="transparent-gradient">
        <p className="pl-4 pt-1 text-sm text-slate-800 max-h-[250px] overflow-hidden z-10">
          {thread.content.repeat(100).toLowerCase()}
        </p>
      </CardContent>
      <CardFooter>
        <ThreadActions thread={thread} isFirstAncestor preview />
      </CardFooter>
    </Card>
  );
}
