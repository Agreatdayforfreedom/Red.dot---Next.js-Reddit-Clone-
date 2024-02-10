import React from "react";
import { BiMessage } from "react-icons/bi";

import { Button } from "@/components/ui/button";

interface Props {
  isFirstAncestor: boolean;
  openForm: () => void;
}

export default function ReplyAction({ isFirstAncestor, openForm }: Props) {
  if (isFirstAncestor) {
    return (
      <Button disabled variant={"link"} className="space-x-1 p-1">
        <BiMessage size={18} className="mt-1" />
        <span>Comments</span>
      </Button>
    );
  }
  return (
    <Button variant={"link"} className="p-1 flex space-x-1" onClick={openForm}>
      <BiMessage size={18} className="mt-1" />
      <span>Reply</span>
    </Button>
  );
}
