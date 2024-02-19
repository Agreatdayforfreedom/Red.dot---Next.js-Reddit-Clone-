import React, { MouseEvent, useOptimistic, useTransition } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Thread, VoteType } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  thread: Thread;
  isFirstAncestor: boolean;
  preview: boolean;
}

export default function VoteAction({
  thread: self,
  preview,
  isFirstAncestor,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [thread, optimisticValue] = useOptimistic(
    self,
    (current, action: VoteType) => {
      // console.log({ action });
      if (current.totalvotes)
        if (current.voted === action) {
          current.voted = null;
          if (action === "UP") current.totalvotes[0] -= 1;
          if (action === "DOWN") current.totalvotes[1] -= 1;
        } else {
          if (action === "UP") {
            if (current.voted === "DOWN") {
              current.totalvotes[1] -= 1;
            }
            current.totalvotes[0] += 1;
          }
          if (action === "DOWN") {
            if (current.voted === "UP") {
              current.totalvotes[0] -= 1;
            }
            current.totalvotes[1] += 1;
          }
          current.voted = action as VoteType;
        }
      return current;
    }
  );
  function handleClick(e: MouseEvent<HTMLButtonElement>, type: "UP" | "DOWN") {
    e.stopPropagation();
    if (isPending) return;
    startTransition(async () => {
      optimisticValue(type);
      await axios.patch(`/api/r/thread/${thread.id}/vote`, {
        voteType: type,
      });
    });
  }
  return (
    <div
      className={cn(
        "flex flex-col items-center mt-2 px-1",
        !isFirstAncestor && !preview && "flex-row space-x-2 "
      )}
    >
      <button
        className=" hover:bg-[#1a1a1a20] rounded-[2px]"
        onClick={(e) => handleClick(e, "UP")}
      >
        <svg
          className={cn(
            " stroke-slate-500 hover:stroke-[#cc3700]",
            thread.voted === "UP" && "fill-[#cc3700] stroke-[#cc3700]"
          )}
          width="26"
          height="26"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeWidth="1.2"
          strokeLinejoin="round"
          stroke="currentColor"
          fill="none"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
        </svg>
      </button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-sm">
              {(thread.totalvotes &&
                thread.totalvotes[0] - thread.totalvotes[1]) ??
                0}
            </span>
          </TooltipTrigger>
          {isFirstAncestor && !preview && (
            <TooltipContent side="right" sideOffset={10}>
              <p>
                {thread.totalvotes &&
                  100 -
                    (thread.totalvotes[1] /
                      (thread.totalvotes[0] + thread.totalvotes[1])) *
                      100}
                % Upvoted
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <button
        className="hover:bg-[#1a1a1a20] rounded-[2px]"
        onClick={(e) => handleClick(e, "DOWN")}
      >
        <svg
          className={cn(
            "stroke-slate-500 hover:stroke-[#5a75cc]",
            thread.voted === "DOWN" && "fill-[#5a75cc] stroke-[#5a75cc]"
          )}
          width="26"
          height="26"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeWidth="1.2"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z" />
        </svg>
      </button>
    </div>
  );
}
