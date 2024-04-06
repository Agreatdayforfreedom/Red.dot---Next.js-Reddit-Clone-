"use client";
import { useEffect } from "react";
import { useCommunity } from "../../../../../../../store/use-community";
import { Community } from "@prisma/client";
import DescendantThread from "../../../../../../../components/thread/descendant-thread";

export const SetCommunity = ({
  thread,
  community,
}: {
  thread: any;
  community: Community;
}) => {
  const { setCommunity } = useCommunity((state) => state);

  useEffect(() => {
    setCommunity(community);
  }, []);

  if (!community) return <p>loading</p>;
  return <DescendantThread thread={thread.children} />;
};
