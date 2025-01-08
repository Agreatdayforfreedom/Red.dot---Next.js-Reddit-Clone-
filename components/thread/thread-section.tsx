"use client";
import React, { useEffect, useState } from "react";
import { Community, User } from "@prisma/client";
import { useParams } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import ThreadCard from "@/components/thread/thread-card";
import DescendantThread from "@/components/thread/descendant-thread";
import ThreadForm from "@/components/thread/thread-form";
import { NestedThread } from "@/types";
import { useIntercept } from "@/store/use-intercept";
import { useCommunity } from "@/store/use-community";

interface Props {
  thread: NestedThread;
  intercepted?: boolean;
  community?: Community | null;
  username?: string;
}

export default function ThreadSection({
  thread: self,
  community,
  intercepted = false,
  username,
}: Props) {
  const [thread, setThreadProxy] = useState(self);

  const params = useParams<{ id: string }>();
  const { intercept } = useIntercept();
  const { setCommunity, community: isLoading } = useCommunity();
  useEffect(() => {
    intercept(intercepted);
    if (community) setCommunity(community);
  }, []);

  // sync revalidation on parent (first ancestor)
  useEffect(() => {
    // on parallel routes do not need to revalidate
    if (!intercepted) {
      setThreadProxy(self);
    }
  }, [self]);

  if (!isLoading) return null;
  function optimisticUpdate(
    type: "UPDATE" | "CREATE" | "DELETE",
    data: Partial<NestedThread> | null
  ) {
    if (type === "CREATE") {
      setThreadProxy((prev) => ({
        ...prev,
        children: [
          ...prev.children,
          {
            ...(data as NestedThread),
            children: [],
          },
        ],
      }));
    }
  }

  return (
    <SessionProvider>
      <section className="pb-5 min-h-screen h-full min-w-[560px] w-full bg-white flex flex-col">
        <ThreadCard thread={thread} isFirstAncestor />
        <ThreadForm
          threadId={params.id as string}
          optimisticUpdate={optimisticUpdate}
          label={
            username && [
              <p key={1}>
                Comment as{" "}
                <span
                  className="underline"
                  style={{ color: community?.interactive_elements_color }}
                >
                  u/{username}
                </span>
              </p>,
            ]
          }
        />

        {thread?.children === undefined ? (
          <div className="w-full text-center">
            <p className="font-semibold text-2xl text-slate-700">
              No comments yet
            </p>
          </div>
        ) : (
          <DescendantThread thread={thread.children} />
        )}
      </section>
    </SessionProvider>
  );
}
