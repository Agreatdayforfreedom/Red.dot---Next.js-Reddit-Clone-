"use client";
import { FaRegHeart } from "react-icons/fa";
import { BiMessage } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineSaveAlt } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { LuPencil } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Thread } from "@/types";
import ThreadDeleteButton from "@/components/thread/thread-delete-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThreadUpdateButtom from "./thread-update-button";

interface Props {
  onReply?: (type: any) => void;
  userId?: string | undefined;
  thread: Thread;
  isFirstAncestor?: boolean;
  preview?: boolean;
}

export default function ThreadActions({
  thread,
  userId,
  isFirstAncestor = false,
  preview = false,
  onReply,
}: Props) {
  const onClick = (type: any) => {
    if (userId && onReply) {
      onReply(type);
    } else {
      //parallel login route
    }
  };
  return (
    <div className="flex space-x-1">
      <button className="mx-1 ">
        <FaRegHeart size={20} />
      </button>

      {isFirstAncestor ? (
        <Button disabled variant={"link"} className="space-x-1 p-1">
          <BiMessage size={18} className="mt-1" />
          <span>Comments</span>
        </Button>
      ) : (
        <Button
          variant={"link"}
          className="p-1 flex space-x-1"
          onClick={() => onClick("CREATE")}
        >
          <BiMessage size={18} className="mt-1" />
          <span>Reply</span>
        </Button>
      )}
      <Button variant={"link"} className="space-x-1 p-1">
        <IoIosShareAlt size={18} className="mt-1" />
        <span>Share</span>
      </Button>
      {!preview && (
        <Popover>
          <PopoverTrigger>
            <BsThreeDots />
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2 flex flex-col space-y-1">
            <Button variant={"link"} className="mx-1 p-1 space-x-1">
              <MdOutlineSaveAlt /> <span>Save</span>
            </Button>
            {userId && userId === thread.user.id && !thread.deleted && (
              <>
                <ThreadUpdateButtom
                  isFirstAncestor={isFirstAncestor}
                  threadId={thread.id}
                  onClick={() => onClick("UPDATE")}
                />
                <ThreadDeleteButton userId={userId} id={thread.id} />
              </>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
