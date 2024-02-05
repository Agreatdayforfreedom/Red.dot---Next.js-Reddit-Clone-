"use client";
import { FaRegHeart } from "react-icons/fa";
import { BiMessage } from "react-icons/bi";
import { MdOutlineSaveAlt } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { Thread } from "@/types";
import ThreadDeleteButton from "@/components/thread/thread-delete-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThreadUpdateButtom from "@/components/thread/thread-update-button";
import ShareButton from "@/components/thread/share-button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { like } from "../../lib/actions";

interface Props {
  onReply?: (type: any) => void;
  // userId?: string | undefined;
  thread: Thread;
  isFirstAncestor?: boolean;
  preview?: boolean;
}

export default function ThreadActions({
  thread,
  // userId,
  isFirstAncestor = false,
  preview = false,
  onReply,
}: Props) {
  const user = useCurrentUser();

  const onClick = (type: any) => {
    if (user && onReply) {
      onReply(type);
    } else {
      //parallel login route
    }
  };
  return (
    <div className="flex space-x-1">
      <button
        className="mx-1 flex items-center space-x-1"
        onClick={() => user?.id && like(thread.id, user.id)}
      >
        <FaRegHeart size={20} />
        <span>
          {Number(thread.totallikes) > 0 ? Number(thread.totallikes) : ""}
        </span>
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
      <ShareButton currentId={thread.id} />
      {!preview && (
        <Popover>
          <PopoverTrigger>
            <BsThreeDots />
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2 flex flex-col space-y-1">
            <Button variant={"link"} className="mx-1 p-1 space-x-1">
              <MdOutlineSaveAlt /> <span>Save</span>
            </Button>
            {user?.id === thread.user.id && !thread.deleted && (
              <>
                <ThreadUpdateButtom
                  isFirstAncestor={isFirstAncestor}
                  threadId={thread.id}
                  onClick={() => onClick("UPDATE")}
                />
                <ThreadDeleteButton id={thread.id} />
              </>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
