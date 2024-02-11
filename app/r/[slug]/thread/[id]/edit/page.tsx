import React from "react";
import { auth } from "@/auth";
import FormNewPost from "@/components/thread/form-new-post";
import { getNullThread } from "../../../../../lib/actions";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const thread = await getNullThread(params.id);
  if (!thread) {
    return redirect("/");
  }
  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-full text-start mt-2 my-5 p-10">
        <h2 className="font-bold text-2xl text-slate-600">Update Post</h2>
      </div>

      <FormNewPost userId={session?.user?.id!} thread={thread as any} />
    </div>
  );
}
