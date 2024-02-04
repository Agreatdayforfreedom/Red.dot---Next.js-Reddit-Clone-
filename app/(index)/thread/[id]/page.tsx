import React from "react";
// import ThreadCard from "@/components/thread/thread-card";
import { getThread } from "@/lib/actions";
import ThreadCard from "@/components/thread/thread-card";
import DescendantThread from "@/components/thread/descendant-thread";
import { auth } from "@/auth";
import { User } from "@prisma/client";
import ThreadForm from "../../../../components/thread/thread-form";

export default async function Page({ params }: any) {
  const [thread] = await getThread(params.id);
  const session = await auth();
  return (
    <main className=" flex bg-stone-900 justify-center">
      <section className="w-4/5 py-5 bg-white ">
        <ThreadCard
          thread={thread}
          user={session?.user as User}
          isFirstAncestor
        />
        <hr />
        <ThreadForm
          threadId={params.id}
          userId={session?.user?.id!}
          label="Reply"
        />

        <DescendantThread
          thread={thread.children}
          user={session?.user as User}
        />
      </section>
    </main>
  );
}
