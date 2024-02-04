import React from "react";
import FormNewPost from "@/components/thread/form-new-post";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <main className="h-full w-full flex flex-col items-center">
      <div className="w-full text-start mt-2 my-5 p-10">
        <h2 className="font-bold text-2xl text-slate-600">Create Post</h2>
      </div>

      <FormNewPost userId={session?.user?.id!} />
    </main>
  );
}
