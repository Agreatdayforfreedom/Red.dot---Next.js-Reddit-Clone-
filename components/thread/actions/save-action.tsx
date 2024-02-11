import React, { useTransition } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineSaveAlt } from "react-icons/md";
import axios from "axios";

import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Thread } from "@/types";
import { useIntercept } from "@/store/use-intercept";
import { saveThread } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  openLoginModal: () => void;
  thread: Thread;
}

export default function SaveAction({ thread, openLoginModal }: Props) {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const { intercepted } = useIntercept();
  const router = useRouter();
  const onClickSave = () => {
    if (user) {
      startTransition(async () => {
        if (intercepted) {
          await axios.post(`/api/r/thread/${thread.id}/save`);
          router.refresh();
        } else {
          await saveThread(thread.id, user.id!);
        }
      });
    } else {
      openLoginModal();
    }
  };

  return (
    <Button
      disabled={isPending || thread.saved}
      variant={"link"}
      onClick={onClickSave}
      className="mx-1 p-1 space-x-1"
    >
      {thread.saved ? (
        <>
          <FaCheck size={18} className="text-green-500" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <MdOutlineSaveAlt />
          <span>Save</span>
        </>
      )}
    </Button>
  );
}
