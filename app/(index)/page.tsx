import ThreadCard from "@/components/thread/thread-card";
import { getNullThreads } from "@/lib/actions";
import type { MissingKeys, RawThread, Thread } from "@/types";
import { auth } from "@/auth";
import ThreadPreviewCard from "@/components/thread/thread-preview-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeaderMainPage from "@/components/header-main-page";
import { SessionProvider } from "next-auth/react";
import PopularCommunities from "../../components/community/popular-communities";
import { $assingRawUser } from "../../lib/format-raw";
// import { Thread } from "@prisma/client";

export default async function Home() {
  const threads: RawThread[] = await getNullThreads();
  // const TODO = threads.map((t: any) => {
  //   //TODO DELTE THIS
  //   return { ...t, totallikes: t.likes.length };
  // });

  return (
    <div className=" bg-slate-100">
      <SessionProvider>
        <HeaderMainPage />
        <section className=" h-full w-4/5 flex  mx-auto py-5 ">
          <div className="w-4/5">
            {threads.map((thread) => (
              <ThreadPreviewCard
                thread={$assingRawUser(thread)}
                key={thread.id}
              />
            ))}
          </div>

          <PopularCommunities />
        </section>
      </SessionProvider>
    </div>
  );
}
