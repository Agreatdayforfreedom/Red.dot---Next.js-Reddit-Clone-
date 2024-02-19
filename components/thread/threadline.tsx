import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useCommunity } from "../../store/use-community";

interface Props {
  onCollapse?: () => void;
  static_line?: boolean;
}

export default function ThreadLine({ onCollapse, static_line = false }: Props) {
  const [hover, setHover] = useState(false);
  const { community } = useCommunity();

  let staticClass = "";
  let c_staticClass = "";
  let styles = { borderColor: community.interactive_elements_color ?? "black" };
  if (static_line) {
    staticClass =
      "!top-0 !left-0 !h-full group-hover:!border-inherit hover:!cursor-default";

    c_staticClass = "group-hover:!border-slate-300 ";
  }

  function handleHover() {
    setHover(!hover);
  }
  return (
    <div
      onClick={onCollapse}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      className={cn(
        "absolute left-[30px] mt-1 height-line z-40 top-8 w-4 group  hover:cursor-pointer flex items-center",

        staticClass
      )}
    >
      <div
        style={hover ? styles : {}}
        className={cn(
          "w-px  mx-auto h-full border border-slate-200",
          c_staticClass
        )}
      ></div>
    </div>
  );
}
