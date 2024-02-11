import React from "react";
import { SessionProvider } from "next-auth/react";

import { getThread } from "@/lib/actions";

import currentUser from "@/lib/currentUser";
import ThreadSection from "@/components/thread/thread-section";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  console.log(params);
  const [thread] = await getThread(params.id, user?.id!);
  return (
    <div className="flex bg-stone-900 min-h-screen justify-center">
      <div className="w-4/5">
        <ThreadSection thread={thread} />
      </div>
    </div>
  );
}
