import axios from "axios";
import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CommunityInfo from "@/components/community/community-info";
import ThreadPreviewCard from "@/components/thread/thread-preview-card";
import { Community, Prisma } from "@prisma/client";
import currentUser from "@/lib/currentUser";
import JoinButton from "@/components/community/join-button";
import { $assingRawUser } from "@/lib/format-raw";
import { RawThread } from "@/types";

export default async function Page({ params }: { params: { slug: string } }) {
  const user = await currentUser();
  const [community]: Array<
    Community & { ismember: boolean; totalmembers: number }
  > = await db.$queryRaw`
    SELECT c.*, 
    EXISTS(SELECT * FROM join_user_community j WHERE c.id = j."communityId" AND "userId" = ${Prisma.raw(
      `'${user?.id!}'`
    )}) as ismember,
    COUNT(j.*)::int as totalmembers
    FROM community c
    LEFT JOIN join_user_community j ON c.id = j."communityId"
      WHERE name = ${Prisma.raw(`'${params.slug}'`)} GROUP BY c.id
  `;

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

  return (
    <div
      className="h-screen"
      style={{ background: community.background_color }}
    >
      <header className="w-full h-11"></header>
      <div className="w-full h-16 bg-white">
        <div className="w-4/5 mx-auto px-4 flex">
          <div>
            <h1 className="text-2xl">{community.name}</h1>
            <p className="text-slate-600">r/{community.name}</p>
          </div>
          <div className="m-2">
            <JoinButton community={community} />
          </div>
        </div>
      </div>
      <div className="  flex flex-col md:flex-row  md:w-4/5 mx-auto">
        {/* posts */}
        <div className="md:w-4/6">
          {threads.map((t) => (
            <ThreadPreviewCard thread={$assingRawUser(t)} />
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
