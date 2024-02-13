import React from "react";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import CommunityInfo from "@/components/community/community-info";
import ThreadPreviewCard from "@/components/thread/thread-preview-card";
import { Community, Prisma } from "@prisma/client";
import currentUser from "@/lib/currentUser";
import JoinButton from "@/components/community/join-button";
import { $assingRawUser } from "@/lib/format-raw";
import { RawThread } from "@/types";
import Avatar from "@/components/community/avatar";
import UpdatePopover from "@/components/community/update-popover";
import HeaderCommunity from "@/components/community/header-community";
import { getCommunity } from "@/lib/actions";

export default async function Page({ params }: { params: { slug: string } }) {
  const user = await currentUser();

  const community = await getCommunity(params.slug);
  if (!community) return notFound();

  const threads: RawThread[] = await db.$queryRaw`
    SELECT 
      t.*, 
      u.id as user_id,
      u.image as user_image,
      u.name as user_name, 
      COUNT(l.*) as totallikes,
      EXISTS(SELECT * FROM likes ll WHERE ll."threadId" = t.id AND ll."userId" = ${Prisma.raw(
        `'${user?.id!}'`
      )}) AS liked
      FROM thread t
        LEFT JOIN "user" u ON u.id = t."userId" 
        LEFT JOIN likes l ON l."threadId" = t.id
     WHERE t."communityId" = ${Prisma.raw(
       `'${community.id}'`
     )} GROUP BY t.id, u.id
  `;

  let background: Record<any, any> = { background: community.background_color };
  if (community.background_image) {
    background = { backgroundImage: `url(${community.background_image})` };
  }

  return (
    <div className="min-h-screen" style={background}>
      <HeaderCommunity community={community} />
      <div className="w-full h-16 bg-white">
        <div className="w-4/5 mx-auto px-4  flex justify-between">
          <div className="flex">
            <div className="flex space-x-2">
              <Avatar community={community} />
              <div>
                <h1 className="text-2xl">{community.name}</h1>
                <p className="text-slate-600">r/{community.name}</p>
              </div>
            </div>
            <div className="m-2">
              <JoinButton community={community} />
            </div>
          </div>
          <UpdatePopover community={community} />
          <div></div>
        </div>
      </div>
      <div className="  flex flex-col md:flex-row  md:w-4/5 mx-auto">
        {/* posts */}
        <div className="md:w-4/6">
          {threads.map((t) => (
            <ThreadPreviewCard key={t.id} thread={$assingRawUser(t)} />
          ))}
        </div>
        {/* aside */}
        <aside className="flex-1 ">
          <CommunityInfo community={community} />
        </aside>
      </div>
    </div>
  );
}
