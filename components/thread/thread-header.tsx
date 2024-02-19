import React from "react";
import moment from "moment";

interface Props {
  username: string;
  created_at: Date;
}

export default function ThreadHeader({ username, created_at }: Props) {
  return (
    <div className="flex items-center text-sm ml-1 space-x-px">
      <p className="text-stone-900 font-semibold hover:underline hover:cursor-pointer">
        {username}
      </p>
      <span className="text-slate-500 px-1"> &#183; </span>
      <p className="text-slate-500 font-light leading-4">
        {moment(created_at, "YYYYMMDD").fromNow()}
      </p>
    </div>
  );
}
