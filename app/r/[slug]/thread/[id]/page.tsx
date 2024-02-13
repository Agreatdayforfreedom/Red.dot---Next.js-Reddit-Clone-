import React from "react";
import { SessionProvider } from "next-auth/react";

import { getCommunity, getThread } from "@/lib/actions";

import currentUser from "@/lib/currentUser";
import ThreadSection from "@/components/thread/thread-section";
import { db } from "@/lib/db";
import { Community, Prisma } from "@prisma/client";
import CommunityInfo from "@/components/community/community-info";
import HeaderCommunity from "../../../../../components/community/header-community";

export default async function Page({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const user = await currentUser();

  const [thread] = await getThread(params.id);
  const community = await getCommunity(params.slug);
  //TODO: COMMUNITY PROOPS AND ZUSTAND
  //TODO:
  return (
    <div
      className="flex flex-col min-h-screen items-center"
      style={{ background: `url(${community?.background_image})` }}
    >
      <HeaderCommunity asPost community={community} />
      <div className="flex w-4/5 mt-5 rounded">
        <div className="md:w-4/6">
          <ThreadSection thread={thread} community={community} />
        </div>
        {community && (
          <aside className="flex-1">
            <CommunityInfo community={community} />
          </aside>
        )}
      </div>
    </div>
  );
}
