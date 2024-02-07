"use client";
import React from "react";
import ThreadCard from "@/components/thread/thread-card";
import DescendantThread from "@/components/thread/descendant-thread";
import ThreadForm from "@/components/thread/thread-form";
import { useParams } from "next/navigation";
import { NestedThread } from "@/types";
import { SessionProvider } from "next-auth/react";
export default function ThreadSection({ thread }: { thread: NestedThread }) {
  const params = useParams<{ id: string }>();

  return (
    <section className="py-5 h-full bg-white flex flex-col">
      <SessionProvider>
        <ThreadCard
          thread={thread}
          // user={session?.user as User}
          isFirstAncestor
        />
        <hr />
        <ThreadForm threadId={params.id as string} label="Reply" />

        {thread.children === undefined ? (
          <div className="w-full  text-center">
            <p className="font-semibold text-2xl text-slate-700">
              No comments yet
            </p>
          </div>
        ) : (
          <DescendantThread thread={thread.children} />
        )}
      </SessionProvider>
    </section>
  );
}
