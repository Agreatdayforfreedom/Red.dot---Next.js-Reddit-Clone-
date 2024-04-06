"use client";
import React from "react";
import { TiArrowRight } from "react-icons/ti";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { NestedThread } from "@/types";
import { useCommunity } from "../../store/use-community";

interface Props {
  thread: NestedThread;
}

export const ContinueThread = ({ thread }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const community = useCommunity((state) => state.community);

  if (!community) return;
  if (thread.children.length === 0 && thread.haschildren === 1)
    return (
      <div className="w-fit px-12 py-2 mt-4">
        <div
          onClick={() => router.push(pathname + "/" + thread.id)}
          style={{ color: community.interactive_elements_color }}
          className="flex items-center text-sm font-semibold hover:translate-x-2 transition-all cursor-pointer"
        >
          Continue this thread <TiArrowRight size={20} />
        </div>
      </div>
    );
};
