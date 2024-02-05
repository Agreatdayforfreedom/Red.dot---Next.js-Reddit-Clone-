import React from "react";
import { Thread } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { cn } from "@/lib/utils";
import ThreadActions from "@/components/thread/thread-actions";
import ThreadHeader from "./thread-header";
import { User } from "@prisma/client";
import useCurrentUser from "../../hooks/useCurrentUser";

export type ClassName = {
  card: string;
  user_info: string;
  header: string;
};
interface Props {
  thread: Thread;
  className?: ClassName;
  isFirstAncestor?: boolean;
  // user: User | undefined;
}
const defaultClassName: ClassName = {
  card: "",
  user_info: "",
  header: "",
};
export default function ThreadCard({
  thread,
  className = defaultClassName,
  // user,
  isFirstAncestor,
}: Props) {
  return (
    <Card
      className={cn(
        "relative shadow-none rounded-none border-none",
        className.card
      )}
    >
      <CardHeader className={className.header}>
        <div className={cn("flex items-center", className.user_info)}>
          <Image
            src={thread.user?.image ?? ""}
            alt={`${thread.user?.name} avatar`}
            width={30}
            height={30}
            className="rounded-full"
          />
          <ThreadHeader
            created_at={thread.created_at}
            username={thread.user.name}
          />
        </div>
        {/* // TODO: set title to null if it is child */}
        {isFirstAncestor && (
          <CardTitle className="text-xl">{thread.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {thread.deleted ? (
          "[deleted]"
        ) : (
          <p className="pl-4 pt-1 text-sm text-slate-800">{thread.content}</p>
        )}
      </CardContent>
      <CardFooter className="pb-2">
        <ThreadActions isFirstAncestor thread={thread} />
      </CardFooter>
    </Card>
  );
}
