"use client";
import { Community } from "@prisma/client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuCakeSlice } from "react-icons/lu";
import moment from "moment";
import { getContrastYIQ } from "@/lib/yiq";
import { useRouter } from "next/navigation";
import CommunityButton from "@/components/community/button-community";
import { cn } from "@/lib/utils";
import { useCommunity } from "@/store/use-community";

interface Props {
  community: Community & { ismember?: boolean; totalmembers?: number };
  className?: string;
  asPost?: boolean;
}

export default function CommunityInfo({ community, className = "" }: Props) {
  const { setCommunity } = useCommunity();
  useEffect(() => {
    //this is bad!

    setCommunity(community);
  }, [community]);
  const router = useRouter();
  const onClickCreatePost = () => {
    router.push(`/submit?c=${community.name}`);
  };

  let bgHeader: Record<any, any> = { background: community.background_color };
  if (community.header_image)
    bgHeader = { backgroundImage: `url(${community.header_image})` };
  return (
    <Card
      className={cn(
        "hidden md:block rounded-md w-5/6 mx-auto mt-10",
        className
      )}
    >
      <CardHeader className=" rounded-t-md py-4 bg-cover" style={bgHeader}>
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
      <CardFooter className="flex flex-col space-y-2">
        <CommunityButton className="w-full" onClick={onClickCreatePost}>
          Create Post
        </CommunityButton>
      </CardFooter>
    </Card>
  );
}
