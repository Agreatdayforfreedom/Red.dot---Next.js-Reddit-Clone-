"use client";
import React from "react";
import { useCommunity } from "@/store/use-community";
import Link from "next/link";
import { Community } from "@prisma/client";
import Image from "next/image";

export default function HeaderCommunity({
  community,
  asPost = false,
}: {
  community: Community | null;
  asPost?: boolean;
}) {
  let bg: Record<any, string> = {};
  let bg_t: Record<any, string> = {};
  let post_text: Record<any, string> = {};
  if (community) {
    bg = { backgroundImage: `url(${community.header_image})` };
    if (!community.header_image) bg = { background: `#efefef` };
    bg_t = { background: community.background_color + "50" };
    post_text = {
      borderBottomWidth: "3px",
      borderColor: community.interactive_elements_color,
      color: community.interactive_elements_color,
    };
  }
  return (
    <header className="w-full h-36 ">
      <div
        className="w-full h-full bg-cover flex flex-col justify-end"
        style={bg}
      >
        <div className="h-full flex items-center space-x-2 pl-6">
          {asPost && (
            <div
              className={" relative overflow-hidden  w-16  h-16 rounded-full"}
            >
              <Image
                fill
                src={community?.avatar ?? ""}
                alt={"community avatar"}
                className="w-full object-cover"
              />
            </div>
          )}
          <Link
            href={`/r/${community?.name}`}
            className="font-semibold text-2xl hover:underline"
            style={{ color: community?.interactive_elements_color }}
          >
            r/{community?.name}
          </Link>
        </div>
        {asPost && (
          <div className="h-8 w-full flex justify-around" style={bg_t}>
            <Link href="" className="font-bold pt-1" style={post_text}>
              Posts
            </Link>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    </header>
  );
}
