import React from "react";
import moment from "moment";
import Link from "next/link";

interface Props {
  username: string;
  created_at: Date;
  community?: string;
}

export default function PostHeader({ username, created_at, community }: Props) {
  return (
    <div className="flex items-center text-sm ml-1 space-x-1">
      {community && (
        <div className="flex items-center">
          <button className="font-semibold hover:underline">
            r/{community}
          </button>
          <span className="text-slate-500 pl-1"> &#183; </span>
        </div>
      )}
      <p className="text-slate-500 ">
        Posted by u/
        <span className="hover:underline hover:cursor-pointer">{username}</span>
      </p>
      {/* <span className="text-slate-500 px-1"> &#183; </span> */}
      <p className="text-slate-500">
        {moment(created_at, "YYYYMMDD").fromNow()}
      </p>
    </div>
  );
}
