"use client";
import Image from "next/image";
import { useState } from "react";
import { BiExpandVertical } from "react-icons/bi";

import DescendantThread from "@/components/thread/descendant-thread";
import { NestedThread } from "@/types";
import ThreadLine from "@/components/thread/threadline";
import ThreadHeader from "@/components/thread/thread-header";
import { Card } from "@/components/ui/card";
import ThreadActions from "@/components/thread/thread-actions";
import ThreadForm from "@/components/thread/thread-form";

interface Props {
  thread: NestedThread;
  user: any;
}

export default function DescendantCard({ thread, user }: Props) {
  const [collapse, setCollapse] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [type, setType] = useState<"UPDATE" | "CREATE">("CREATE");
  //TODO:
  function reply(type?: "UPDATE" | "CREATE") {
    if (type) setType(type);
    setOpenReply(!openReply);
  }

  return (
    <Card className=" my-1 p-0 border-none shadow-none">
      <div style={{ paddingLeft: `${24}px` }}>
        <div className="share">
          {!collapse && <ThreadLine onCollapse={() => setCollapse(true)} />}
          <div className="flex items-center ">
            {collapse && (
              <BiExpandVertical
                onClick={() => setCollapse(false)}
                size={20}
                className=" mt-2 hover:cursor-pointer"
              />
            )}
            <Image
              src={thread.user?.image ?? ""}
              alt={`${thread.user?.name} avatar`}
              width={36}
              height={36}
              className="rounded-full"
            />
            <ThreadHeader
              username={thread.user.name}
              created_at={thread.created_at}
            />
          </div>

          {/* content and actions here */}

          {!collapse && (
            <div className="pl-10">
              {thread.deleted ? (
                "[deleted]"
              ) : (
                <p className="break-all text-sm p-2">{thread.content}</p>
              )}
              <ThreadActions userId={user.id} thread={thread} onReply={reply} />
              {openReply && (
                <ThreadForm
                  userId={user.id}
                  threadId={thread.id}
                  content={type === "UPDATE" ? thread.content : ""}
                  onReply={reply} //close when create
                  openable
                />
              )}
            </div>
          )}
        </div>
        {!collapse && (
          <DescendantThread
            user={user}
            thread={thread.children}
            key={thread.id}
          />
        )}
      </div>
    </Card>
  );
}
