"use client";
import Image from "next/image";
import { useEffect, useOptimistic, useRef, useState } from "react";
import { BiExpandVertical } from "react-icons/bi";

import DescendantThread from "@/components/thread/descendant-thread";
import { NestedThread } from "@/types";
import ThreadLine from "@/components/thread/threadline";
import ThreadHeader from "@/components/thread/thread-header";
import { Card } from "@/components/ui/card";
import ThreadActions from "@/components/thread/thread-actions";
import { useIntercept } from "../../store/use-intercept";

interface Props {
  thread: NestedThread;
}

export default function DescendantCard({ thread: self }: Props) {
  const [threadProxy, setThreadProxy] = useState(self);
  const [collapse, setCollapse] = useState(false);
  const intercepted = useIntercept((state) => state.intercepted);

  // sync revalidation
  useEffect(() => {
    // on parallel routes do not need to revalidate
    if (!intercepted) {
      setThreadProxy(self);
    }
  }, [self]);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && ref.current?.id === window.location.hash.slice(1)) {
      ref.current.style.background = "rgba(71, 58, 58, 0.2)";
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [ref]);

  const [thread, optimisticValue] = useOptimistic(
    threadProxy,
    (
      current,
      action: {
        type: "UPDATE" | "CREATE" | "DELETE";
        data: Partial<NestedThread> | null;
      }
    ) => {
      if (action.type === "DELETE") {
        current.deleted = true;
      }

      if (action.type === "UPDATE") {
        current = {
          ...current,
          ...action.data,
        };
      }

      return current;
    }
  );

  const optimisticUpdate = (
    type: "UPDATE" | "CREATE" | "DELETE",
    data: Partial<NestedThread> | null
  ) => {
    if (type === "CREATE") {
      setThreadProxy((prev) => ({
        ...prev,
        children: [
          ...prev.children,
          {
            ...(data as NestedThread),
            children: [],
          },
        ],
      }));
    } else {
      optimisticValue({ type, data });
      setThreadProxy((prev) => ({
        ...prev,
        ...data,
      }));
    }
  };

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
            <div className="w-7 h-7 relative">
              <Image
                src={thread.user?.image ?? ""}
                alt={`${thread.user?.name} avatar`}
                fill
                className="rounded-full object-cover"
              />
            </div>
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
              <ThreadActions
                thread={thread}
                optimisticUpdate={optimisticUpdate}
              />
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
