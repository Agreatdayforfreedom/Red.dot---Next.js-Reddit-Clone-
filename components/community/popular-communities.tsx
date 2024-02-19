import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../lib/db";
import Link from "next/link";
import { Community } from "@prisma/client";

export default async function PopularCommunities() {
  const communities = (await db.$queryRaw`
  SELECT name,(SELECT COUNT(*)::int FROM join_user_community WHERE "communityId" = c.id) as totalmembers FROM community AS c ORDER BY totalmembers DESC LIMIT 15;
`) as unknown as (Community & { totalmembers: number })[];

  return (
    <Card className="rounded flex-1">
      <CardHeader>
        <CardTitle>Popular Communities</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-1">
        {communities.map((c) => (
          <Link key={c.id} href={"/r/" + c.name} className="space-x-3">
            <span className="underline">r/{c.name}</span>
            <span className="text-sm text-slate-700">
              {c.totalmembers} members
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
