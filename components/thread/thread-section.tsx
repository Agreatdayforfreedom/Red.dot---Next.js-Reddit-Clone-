"use client";
import React, { useEffect } from "react";
import { Community } from "@prisma/client";
import { useParams } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import ThreadCard from "@/components/thread/thread-card";
import DescendantThread from "@/components/thread/descendant-thread";
import ThreadForm from "@/components/thread/thread-form";
import { NestedThread } from "@/types";
import { useIntercept } from "@/store/use-intercept";
import { useCommunity } from "@/store/use-community";
import Link from "next/link";

interface Props {
  thread: NestedThread;
  intercepted?: boolean;
  community?: Community | null;
}

export default function ThreadSection({
  thread,
  community,
  intercepted = false,
}: Props) {
  const params = useParams<{ id: string }>();
  const { intercept } = useIntercept();
  const { setCommunity } = useCommunity();
  useEffect(() => {
    intercept(intercepted);
    if (community) setCommunity(community);
  }, []);
  return (
    <section className="pb-5 h-full w-full bg-white flex flex-col">
      <SessionProvider>
        {intercepted && (
          <Link
            href={`/r/${community?.name}`}
            className="p-6 pt-3 pb-0 underline text-black"
          >
            r/{community?.name}
          </Link>
        )}
        <ThreadCard thread={thread} isFirstAncestor />
        <hr />
        <ThreadForm threadId={params.id as string} label="Reply" />

        {thread?.children === undefined ? (
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
