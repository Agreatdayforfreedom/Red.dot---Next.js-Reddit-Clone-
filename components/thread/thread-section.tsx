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
import useCurrentUser from "@/hooks/useCurrentUser";

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
  const user = useCurrentUser();
  const { intercept } = useIntercept();
  const { setCommunity } = useCommunity();
  useEffect(() => {
    intercept(intercepted);
    if (community) setCommunity(community);
  }, []);
  return (
    <SessionProvider>
      <section className="pb-5 h-full w-full bg-white flex flex-col">
        <ThreadCard thread={thread} isFirstAncestor />
        <ThreadForm
          threadId={params.id as string}
          label={[
            <p key={1}>
              Comment as{" "}
              <span
                className="underline"
                style={{ color: community?.interactive_elements_color }}
              >
                u/{user?.name}
              </span>
            </p>,
          ]}
        />

        {thread?.children === undefined ? (
          <div className="w-full  text-center">
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
