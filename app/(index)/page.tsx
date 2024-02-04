import ThreadCard from "@/components/thread/thread-card";
import { getNullThreads } from "@/lib/actions";
import type { MissingKeys, Thread } from "@/types";
import { auth } from "@/auth";
import ThreadPreviewCard from "@/components/thread/thread-preview-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeaderMainPage from "@/components/header-main-page";
// import { Thread } from "@prisma/client";

export default async function Home() {
  const threads: Thread[] = await getNullThreads();
  return (
    <main className="h-full">
      <HeaderMainPage />
      <section className="w-4/5 mx-auto py-5 bg-slate-100 ">
        {threads.map((thread: Thread) => (
          <ThreadPreviewCard thread={thread} key={thread.id} />
        ))}
      </section>
    </main>
  );
}
