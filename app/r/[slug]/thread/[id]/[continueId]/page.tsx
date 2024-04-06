import React from "react";
import { TbMenuDeep } from "react-icons/tb";

import { getCommunity, getThread } from "@/lib/actions";
import { SetCommunity } from "./_components/set-community";
import CommunityInfo from "@/components/community/community-info";
import HeaderCommunity from "@/components/community/header-community";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { continueId: string; slug: string; id: number };
}) {
  const [thread] = await getThread(params.continueId);

  const community = await getCommunity(params.slug ?? "");

  if (!community) return null;
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
      <div className="flex w-4/5 mt-5 rounded h-screen mb-10  ">
        <div className="md:w-4/6 bg-white">
          <div className=" py-4 flex justify-between items-center  mx-auto w-[90%]">
            <TbMenuDeep className="size-6 relative stroke-slate-500" />
            <span className="flex-1 h-px bg-slate-200 mx-2"></span>
            <a
              className="text-sm text-slate-500 font-semibold hover:text-slate-700 transition-colors"
              href={`/r/${params.slug}/thread/${params.id}`}
            >
              See full discussion
            </a>
          </div>
          <SetCommunity community={community} thread={thread} />
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
