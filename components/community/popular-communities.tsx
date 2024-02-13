import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../lib/db";
import Link from "next/link";

export default async function PopularCommunities() {
  const communities = await db.community.findMany();
  return (
    <Card className="rounded flex-1">
      <CardHeader>
        <CardTitle>Popular Communities</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-1">
        {communities.map((c) => (
          <Link key={c.id} className="underline" href={"/r/" + c.name}>
            r/{c.name}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
