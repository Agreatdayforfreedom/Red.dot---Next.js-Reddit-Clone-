import { GoTrash } from "react-icons/go";
import { usePathname } from "next/navigation";

import { deleteThread } from "@/lib/actions";
import { Button } from "../ui/button";
import { useTransition } from "react";

export default function ThreadDeleteButton({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const onClick = () => {
    startTransition(async () => {
      await deleteThread(userId, id, pathname);
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
