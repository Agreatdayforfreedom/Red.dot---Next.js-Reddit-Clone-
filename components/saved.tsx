import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getThreadsSaved } from "@/lib/actions";
import currentUser from "../lib/currentUser";
import { Saved, Thread, User } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { MdClose } from "react-icons/md";
import ThreadHeader from "./thread/thread-header";
import Image from "next/image";
import DeleteSavedButton from "./thread/delete-saved-button";

export default async function Saved() {
  const user = await currentUser();
  const saved = await getThreadsSaved(user?.id!);

  if (saved.length === 0)
    return (
      <div className="w-full flex items-center justify-center">
        <p className="text-lg text-slate-500">No threads saved yet</p>
      </div>
    );
  return (
    <div className="max-h-64 overflow-y-scroll no-scrollbar">
      {saved.map((s: Saved & { thread: Thread & { user: User } }) => (
        <div
          key={s.id}
          className="flex items-center w-full justify-between hover:bg-slate-200 p-1 rounded"
        >
          <div className="flex flex-col w-11/12">
            <div className="flex flex-col">
              <Image
                src={s.thread.user?.image ?? ""}
                alt={`${s.thread.user?.name} avatar`}
                width={30}
                height={30}
                className="rounded-full"
              />
              <ThreadHeader
                username={user?.name!}
                created_at={s.thread.created_at}
              />
            </div>
            <Link
              href={`/thread/${s.thread.id}`}
              className="overflow-ellipsis overflow-hidden block whitespace-nowrap"
            >
              {s.thread.content}
            </Link>
          </div>
          <DeleteSavedButton id={s.id} />
        </div>
      ))}
    </div>
  );
}
