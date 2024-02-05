import { GoTrash } from "react-icons/go";
import { usePathname } from "next/navigation";

import { deleteThread } from "@/lib/actions";
import { Button } from "../ui/button";
import { useTransition } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function ThreadDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const user = useCurrentUser();
  const onClick = () => {
    startTransition(async () => {
      if (user?.id) {
        await deleteThread(user.id, id, pathname);
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
