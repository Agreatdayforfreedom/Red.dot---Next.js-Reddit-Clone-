import ThreadCard from "@/components/thread/thread-card";
import { getNullThreads } from "@/lib/actions";
import type { MissingKeys, Thread } from "@/types";
import { auth } from "@/auth";
import ThreadPreviewCard from "@/components/thread/thread-preview-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeaderMainPage from "@/components/header-main-page";
import { SessionProvider } from "next-auth/react";
// import { Thread } from "@prisma/client";

export default async function Home() {
  const threads: Thread[] = await getNullThreads();
  const TODO = threads.map((t: any) => {
    //TODO DELTE THIS
    return { ...t, totallikes: t.likes.length };
  });

  return (
    <div className=" bg-slate-100">
      <SessionProvider>
        <HeaderMainPage />
        <section className=" h-full w-4/5 mx-auto py-5 ">
          {TODO.map((thread: Thread) => (
            <ThreadPreviewCard thread={thread} key={thread.id} />
          ))}
        </section>
      </SessionProvider>
    </div>
  );
}
