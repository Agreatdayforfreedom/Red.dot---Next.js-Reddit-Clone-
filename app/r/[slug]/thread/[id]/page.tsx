import React from "react";

import { getCommunity, getThread } from "@/lib/actions";

import ThreadSection from "@/components/thread/thread-section";

import CommunityInfo from "@/components/community/community-info";
import HeaderCommunity from "@/components/community/header-community";
import currentUser from "@/lib/currentUser";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const [thread] = await getThread(params.id);
  const user = await currentUser();
  if (!thread) return notFound();
  const community = await getCommunity(params.slug);

  return (
    <div
      className="flex flex-col min-h-screen items-center"
      style={{
        background: community.background_image
          ? `url(${community.background_image})`
          : community.background_color,
      }}
    >
      <HeaderCommunity asPost community={community} />
      <div className="flex w-11/12 lg:w-4/5 mt-5 rounded">
        <div className="w-full">
          <ThreadSection
            username={user?.name || ""}
            thread={thread}
            community={community}
          />
        </div>
        {community && (
          <aside className="flex-1 hidden lg:block ml-4">
            <CommunityInfo community={community} />
          </aside>
        )}
      </div>
    </div>
  );
}
