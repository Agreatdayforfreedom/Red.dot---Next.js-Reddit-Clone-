import React from "react";
import { Button } from "@/components/ui/button";
import { LuPencil } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isFirstAncestor?: boolean;
  threadId: string;
}

export default function ThreadUpdateButtom({
  isFirstAncestor = false,
  threadId,
  ...props
}: Props) {
  const router = useRouter();
  const push = () => {
    //????????????????????????????????????????????????
    router.push(`/thread/${threadId}/edit`);
    router.refresh();
  };

  if (isFirstAncestor) {
    return (
      <Button
        variant={"link"}
        onClick={push}
        className="hover:text-orange-500 flex space-x-1 "
      >
        {/* <Link href={`/thread/${threadId}/edit`} className="flex space-x-1"> */}
        <LuPencil className="mt-1" /> <span>Update</span>
        {/* </Link> */}
      </Button>
    );
  }
  return (
    <Button
      variant={"link"}
      className="hover:text-orange-500 space-x-1"
      {...props}
    >
      <LuPencil /> <span>Update</span>
    </Button>
  );
}
