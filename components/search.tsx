"use client";
import { Community } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCommunity } from "../store/use-community";
import { Input } from "./ui/input";
import { MdClose } from "react-icons/md";
import { getContrastYIQ } from "../lib/yiq";
import { useParams } from "next/navigation";

export const Search = () => {
  const params = useParams();
  const community = useCommunity((state) => state.community);
  const setClear = useCommunity((state) => state.setClear);

  useEffect(() => {
    if (!!community) setClear();
  }, [params]);
  const [avoidCommunityFilter, setAvoidCommunityFilter] =
    useState<boolean>(false);

  const handleAvoidCF = () => {
    setAvoidCommunityFilter(true);
  };

  return (
    <div className="flex rounded-lg p-1 border">
      {community?.avatar && !avoidCommunityFilter && (
        <div
          className="space-x-1 p-1 flex items-center rounded-full"
          style={{ background: `${community.background_color}60` }}
        >
          <div className="relative w-4 h-4">
            <Image
              fill
              src={community.avatar}
              alt="community image"
              className="object-cover rounded-full"
            />
          </div>
          <p className="text-sm font-semibold max-w-32 overflow-hidden text-ellipsis">
            {community?.name}
          </p>
          <button onClick={handleAvoidCF}>
            <MdClose
              size={14}
              className="rounded-full"
              style={{
                background: community.interactive_elements_color,
                fill: getContrastYIQ(community.interactive_elements_color),
              }}
            />
          </button>
        </div>
      )}
      <Input
        className="focus-visible:ring-0 border-none h-auto "
        placeholder="Search..."
      />
    </div>
  );
};
