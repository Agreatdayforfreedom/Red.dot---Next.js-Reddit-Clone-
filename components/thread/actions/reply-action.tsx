import React from "react";
import { BiMessage } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Thread } from "@/types";

interface Props {
  isFirstAncestor: boolean;
  openForm: () => void;
  totalComments: number;
}

export default function ReplyAction({
  isFirstAncestor,
  openForm,
  totalComments,
}: Props) {
  if (isFirstAncestor) {
    return (
      <Button variant={"link"} className="space-x-1 p-1">
        <BiMessage size={18} className="mt-1" />
        {/* //TODO: do the same with posts */}
        <span>{totalComments} Comments</span>
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
