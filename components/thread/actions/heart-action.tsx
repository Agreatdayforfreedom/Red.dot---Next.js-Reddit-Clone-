import { useState, useTransition } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Heart from "@/components/heart";
import { Thread } from "@/types";
import { useIntercept } from "@/store/use-intercept";
import useCurrentUser from "@/hooks/useCurrentUser";
import { like } from "@/lib/actions";

interface Props {
  openLoginModal: () => void;
  thread: Thread;
}

export default function HeartAction({ thread, openLoginModal }: Props) {
  const [clicked, setClicked] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const { intercepted } = useIntercept();
  const user = useCurrentUser();

  const onClick = async ({}) => {
    if (user) {
      startTransition(async () => {
        thread.liked === false && setClicked(true);
        //route handler
        if (intercepted) {
          await axios.put(`/api/thread/${thread.id}/like`, {
            userId: user.id,
          });

          router.refresh();
        } else {
          //server actions
          await like(thread.id, user.id ?? "");
        }
      });
      setTimeout(() => {
        setClicked(false);
      }, 1600);
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="flex items-center">
      <Heart
        liked={thread.liked ?? false}
        clicked={clicked}
        onClick={onClick}
        disabled={isPending}
      />
      <span>
        {Number(thread.totallikes) > 0 ? Number(thread.totallikes) : ""}
      </span>
    </div>
  );
}
