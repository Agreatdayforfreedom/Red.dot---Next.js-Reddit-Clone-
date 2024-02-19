import ThreadCard from "@/components/thread/thread-card";
import { getNullThreads } from "@/lib/actions";
import type { MissingKeys, RawThread, Thread } from "@/types";
import { auth } from "@/auth";
import ThreadPreviewCard from "@/components/thread/thread-preview-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HomeBanner from "@/components/home-banner";
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
        <section className=" h-full w-5/6 flex mx-auto py-5 ">
          <div className=" w-3/4">
            {threads.map((thread) => (
              <ThreadPreviewCard
                thread={$assingRawUser(thread)}
                key={thread.id}
              />
            ))}
          </div>

          <aside className="flex-1 mt-5 space-y-7">
            <HomeBanner />
            <PopularCommunities />
          </aside>
        </section>
      </SessionProvider>
    </div>
  );
}
