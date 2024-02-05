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
import Heart from "../heart";
import React from "react";
import LoginModal from "../auth/login-modal";
import { usePathname } from "next/navigation";

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
  const [clicked, setClicked] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const user = useCurrentUser();

  const pathname = usePathname();

  const onClickHeart = () => {
    if (user) {
      thread.liked === false && setClicked(true);
      user?.id && like(thread.id, user.id);
      setTimeout(() => {
        setClicked(false);
      }, 1600);
    } else {
      console.log("YOU ARE NOT AUTHENTICATED");
      setModal(true);
    }
  };

  const onClick = (type: any) => {
    if (user && onReply) {
      onReply(type);
    } else {
      console.log("YOU ARE NOT AUTHENTICATED");
      setModal(true);
      //parallel login route
    }
  };

  return (
    <div className="flex space-x-1">
      <LoginModal open={modal} REDIRECT={pathname} />
      {/* <button
        className="mx-1 flex items-center space-x-1"
        onClick={() => user?.id && like(thread.id, user.id)}
      > */}
      <div className="flex items-center">
        <Heart
          liked={thread.liked ?? false}
          clicked={clicked}
          onClick={onClickHeart}
        />
        <span>
          {Number(thread.totallikes) > 0 ? Number(thread.totallikes) : ""}
        </span>
      </div>
      {/* </button> */}

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
      <div></div>
    </div>
  );
}
