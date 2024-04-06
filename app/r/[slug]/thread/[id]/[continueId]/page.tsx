import React from "react";
import { getCommunity, getThread } from "@/lib/actions";
import DescendantThread from "@/components/thread/descendant-thread";
import { SetCommunity } from "./_components/set-community";

export default async function Page({
  params,
}: {
  params: { continueId: string; slug: string };
}) {
  const [thread] = await getThread(params.continueId);

  const community = await getCommunity(params.slug ?? "");

  return <SetCommunity community={community} thread={thread} />;
}
