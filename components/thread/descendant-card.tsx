"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiExpandVertical } from "react-icons/bi";

import DescendantThread from "@/components/thread/descendant-thread";
import { NestedThread } from "@/types";
import ThreadLine from "@/components/thread/threadline";
import ThreadHeader from "@/components/thread/thread-header";
import { Card } from "@/components/ui/card";
import ThreadActions from "@/components/thread/thread-actions";
import ThreadForm from "@/components/thread/thread-form";
import { useParams, usePathname } from "next/navigation";

interface Props {
  thread: NestedThread;
}

export default function DescendantCard({ thread }: Props) {
  const [collapse, setCollapse] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && ref.current?.id === window.location.hash.slice(1)) {
      ref.current.style.background = "rgba(71, 58, 58, 0.2)";
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [ref]);

  //TODO:

  return (
    <Card className="p-0 border-none shadow-none">
      <div style={{ paddingLeft: `${24}px` }}>
        <div className="mr-2" id={thread.id} ref={ref}>
          {!collapse && <ThreadLine onCollapse={() => setCollapse(true)} />}
          <div className="flex items-center ">
            {collapse && (
              <BiExpandVertical
                onClick={() => setCollapse(false)}
                size={20}
                className=" hover:cursor-pointer"
              />
            )}
            <Image
              src={thread.user?.image ?? ""}
              alt={`${thread.user?.name} avatar`}
              width={28}
              height={28}
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
              <ThreadActions thread={thread} />
            </div>
          )}
        </div>
        {!collapse && (
          <DescendantThread thread={thread.children} key={thread.id} />
        )}
      </div>
    </Card>
  );
}
