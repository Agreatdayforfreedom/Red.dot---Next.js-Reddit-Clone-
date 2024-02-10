import React from "react";
import { cn } from "../../lib/utils";

interface Props {
  onCollapse?: () => void;
  static_line?: boolean;
}

export default function ThreadLine({ onCollapse, static_line = false }: Props) {
  let staticClass = "";
  let c_staticClass = "";
  if (static_line) {
    staticClass =
      "!top-0 !left-0 !h-full group-hover:!border-inherit hover:!cursor-default";

    c_staticClass = "group-hover:!border-slate-300 ";
  }
  return (
    <div
      onClick={onCollapse}
      className={cn(
        "absolute left-[30px] height-line z-40 top-8 w-4 group  hover:cursor-pointer flex items-center",
        staticClass
      )}
    >
      <div
        className={cn(
          "w-px  mx-auto h-full border border-slate-200 group-hover:border-black ",
          c_staticClass
        )}
      ></div>
    </div>
  );
}
