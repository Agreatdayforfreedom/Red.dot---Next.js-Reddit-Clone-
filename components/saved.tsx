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

  return (
    <div>
      {saved.map((s: Saved & { thread: Thread & { user: User } }) => (
        <div
          key={s.id}
          className="flex items-center justify-between hover:bg-slate-200 p-1 rounded"
        >
          <div className="flex flex-col">
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
            <Button variant={"link"}>
              <Link href={`/thread/${s.thread.id}`}>
                <span>{s.thread.content}</span>
              </Link>
            </Button>
          </div>
          <DeleteSavedButton id={s.id} />
        </div>
      ))}
    </div>
  );
}
