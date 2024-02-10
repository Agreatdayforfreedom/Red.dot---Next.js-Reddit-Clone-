"use client";
import { BsThreeDots } from "react-icons/bs";
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
import React, { useState } from "react";
import LoginModal from "@/components/auth/login-modal";
import { usePathname } from "next/navigation";
import ThreadForm from "./thread-form";
import HeartAction from "./actions/heart-action";
import ReplyAction from "./actions/reply-action";
import SaveAction from "./actions/save-action";

interface Props {
  onReply?: (type: any) => void;
  thread: Thread;
  isFirstAncestor?: boolean;
  preview?: boolean;
}

export default function ThreadActions({
  thread,
  isFirstAncestor = false,
  preview = false,
}: Props) {
  const [modal, setModal] = useState(false);
  const [popover, setPopover] = useState(false);
  const [openReply, setOpenReply] = useState(false);

  const [type, setType] = useState<"UPDATE" | "CREATE">("CREATE");

  const user = useCurrentUser();

  const pathname = usePathname();

  const showPopover =
    !preview && user?.id === thread.user.id && !thread.deleted;
  function onReply(type?: "UPDATE" | "CREATE") {
    if (type) setType(type);
    setOpenReply(!openReply);
  }

  const onClick = (type: any) => {
    if (user) {
      onReply(type);
      setPopover(false);
    } else {
      setModal(true);
    }
  };

  return (
    <div>
      <div className="flex space-x-1">
        <LoginModal
          open={modal}
          onClose={() => setModal(false)}
          REDIRECT={pathname}
        />

        <HeartAction openLoginModal={() => setModal(true)} thread={thread} />

        <ReplyAction isFirstAncestor openForm={() => onReply("CREATE")} />

        <ShareButton currentId={thread.id} />

        {showPopover && (
          <Popover open={popover} onOpenChange={setPopover}>
            <PopoverTrigger>
              <BsThreeDots />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2 flex flex-col space-y-1">
              <>
                <SaveAction
                  thread={thread}
                  openLoginModal={() => setModal(true)}
                />
                <ThreadUpdateButtom
                  isFirstAncestor={isFirstAncestor}
                  threadId={thread.id}
                  onClick={() => onClick("UPDATE")}
                />
                <ThreadDeleteButton
                  id={thread.id}
                  closePopover={() => setPopover(false)}
                />
              </>
            </PopoverContent>
          </Popover>
        )}
      </div>
      {openReply && (
        <ThreadForm
          threadId={thread.id}
          content={type === "UPDATE" ? thread.content : ""}
          onReply={onReply} //close when create
          openable
        />
      )}
    </div>
  );
}
