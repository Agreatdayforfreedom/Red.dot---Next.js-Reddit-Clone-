import { GoTrash } from "react-icons/go";
import { useRouter } from "next/navigation";

import { deleteThread } from "@/lib/actions";
import { Button } from "../ui/button";
import { useTransition } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useIntercept } from "@/store/use-intercept";
import axios from "axios";
import { NestedThread } from "../../types";

interface Props {
  closePopover: () => void;
  id: string;
  optimisticUpdate: (
    type: "UPDATE" | "CREATE" | "DELETE",
    data: Partial<NestedThread> | null
  ) => void;
}

export default function ThreadDeleteButton({
  id,
  closePopover,
  optimisticUpdate,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();

  const { intercepted } = useIntercept();

  const onClick = () => {
    startTransition(async () => {
      if (user?.id) {
        if (intercepted) {
          optimisticUpdate("DELETE", null);
          await axios.delete(`/api/r/thread/${id}`);
        } else {
          await deleteThread(user.id, id);
        }
        closePopover();
      }
    });
  };
  return (
    <Button
      variant={"ghost"}
      className="hover:bg-red-500 disabled:bg-red-700/50 disabled:text-white hover:text-white p-3  space-x-1 flex items-center"
      onClick={onClick}
      disabled={isPending}
    >
      <GoTrash />
      <span>Delete</span>
    </Button>
  );
}
