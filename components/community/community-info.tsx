"use client";
import { Community } from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuCakeSlice } from "react-icons/lu";
import moment from "moment";
import { getContrastYIQ } from "../../lib/yiq";
import { useRouter } from "next/navigation";
export default function CommunityInfo({
  community,
}: {
  community: Community & { ismember: boolean; totalmembers: number };
}) {
  const router = useRouter();
  const onClickCreatePost = () => {
    router.push(`/submit?c=${community.name}`);
  };
  return (
    <Card className="hidden md:block rounded-md w-5/6 mx-auto mt-10">
      <CardHeader
        className=" rounded-t-md py-4"
        style={{ background: community.background_color }}
      >
        <CardTitle
          style={{ color: getContrastYIQ(community.background_color) }}
        >
          About Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col border-b pt-2 space-x-1 text-slate-600 space-y-2">
          <h3 className="mt-2">{community.info}</h3>
          <div className="flex item-center">
            <LuCakeSlice size={20} />
            <span>Created {moment(community.created_at).format("dddd")}</span>
          </div>
        </div>
        <div className="border-b pb-3">
          <div className="flex w-fit flex-col items-center">
            <span>{community.totalmembers}</span>
            <span className="text-sm">Members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          style={{
            background: community.interactive_elements_color,
            color: getContrastYIQ(community.interactive_elements_color),
          }}
          onClick={onClickCreatePost}
        >
          Create Post
        </Button>
      </CardFooter>
    </Card>
  );
}
