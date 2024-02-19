"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Thread } from "@/types";
import ThreadActions from "@/components/thread/thread-actions";
import { cn } from "@/lib/utils";
import PostHeader from "@/components/thread/post-header";
import VoteAction from "@/components/thread/actions/vote-action";

interface Props {
  thread: Thread;
}

export default function ThreadPreviewCard({ thread }: Props) {
  // console.log(thread);
  const params = useParams();
  const router = useRouter();
  function onNavigate() {
    let slug = thread.community_name ? thread.community_name : params.slug;

    if (window.getSelection()?.toString()) return; // prevent navigation when select text
    router.push(`/r/${slug}/thread/${thread.id}`);
  }
  return (
    <Card
      className="hover:border-black border-slate-500 bg-slate-300 flex  my-5 hover:cursor-pointer w-11/12 mx-auto rounded"
      onClick={onNavigate}
    >
      <VoteAction thread={thread} isFirstAncestor preview />
      <div className="bg-white space-y-1 w-full">
        <CardHeader className="break-all p-1 ">
          <PostHeader
            community={{
              name: thread.community_name,
              avatar: thread.community_avatar,
            }}
            created_at={thread.created_at}
            username={thread.user.name}
          />
          <CardTitle className="text-xl px-2">{thread.title}</CardTitle>
        </CardHeader>
        <CardContent
          className={cn(
            "p-0 ",
            thread.content.length > 450 && "transparent-gradient" //show opacity on large texts
          )}
        >
          <p className="pl-4 pt-1 text-sm text-slate-800 max-h-[250px] overflow-hidden">
            {thread.content}
          </p>
        </CardContent>
        <CardFooter className="p-1 pt-5">
          <ThreadActions thread={thread} isFirstAncestor preview />
        </CardFooter>
      </div>
    </Card>
  );
}
