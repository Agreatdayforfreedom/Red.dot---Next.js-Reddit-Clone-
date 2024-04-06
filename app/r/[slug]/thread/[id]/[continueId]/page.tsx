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
    <section
      className="pb-5 h-full min-w-[560px] bg-white flex flex-col"
      style={{
        background: community.background_image
          ? `url(${community.background_image})`
          : community.background_color,
      }}
    >
      <HeaderCommunity asPost community={community} />
      <div className="flex w-11/12  mt-5 mx-auto rounded">
        <div className="w-full bg-white pb-10">
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
          <aside className=" hidden lg:block ml-4">
            <CommunityInfo community={community} />
          </aside>
        )}
      </div>
    </section>
  );
}
