import React from "react";
import moment from "moment";

interface Props {
  username: string;
  created_at: Date;
}

export default function ThreadHeader({ username, created_at }: Props) {
  return (
    <div className="flex items-center  text-sm">
      <p className="text-blue-900 font-semibold">{username}</p>
      <span className="text-slate-500 px-1"> &#183; </span>
      <p className="text-slate-500">{moment(created_at).format("dddd")}</p>
    </div>
  );
}
