import React from "react";
import { SessionProvider } from "next-auth/react";
import { User } from "@prisma/client";

import { getThread } from "@/lib/actions";
import ThreadCard from "@/components/thread/thread-card";
import DescendantThread from "@/components/thread/descendant-thread";
import { auth } from "@/auth";
import ThreadForm from "@/components/thread/thread-form";
import Test from "../../../../components/thread/test";

export default async function Page({ params }: any) {
  const [thread] = await getThread(params.id);
  return (
    <div className=" flex bg-stone-900 min-h-screen justify-center">
      <section className="w-4/5 py-5 bg-white flex flex-col ">
        <SessionProvider>
          <ThreadCard
            thread={thread}
            // user={session?.user as User}
            isFirstAncestor
          />
          <hr />
          <ThreadForm threadId={params.id as string} label="Reply" />

          {!thread.children ? (
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
    </div>
  );
}
