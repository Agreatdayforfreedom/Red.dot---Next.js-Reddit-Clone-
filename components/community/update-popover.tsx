"use client";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { PiSelectionBackground } from "react-icons/pi";
import { BiSolidDockTop } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import UploadImage from "./upload_image";
import { TypeImageUpload } from "@/types";
import { Community } from "@prisma/client";

export default function UpdatePopover({ community }: { community: Community }) {
  const [openUpload, setOpenUpload] = useState(false);
  const [type, setType] = useState<TypeImageUpload>();
  function handleClick(t: typeof type) {
    setOpenUpload(true);
    setType(t);
  }

  if (openUpload && type)
    return (
      <UploadImage
        community={community}
        close={() => setOpenUpload(false)}
        open={openUpload}
        type={type}
      />
    );
  return (
    <Popover>
      <PopoverTrigger className="flex mt-2 h-fit">
        <BsThreeDots />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-0 w-fit">
        <Button
          className="space-x-2 justify-start"
          onClick={() => handleClick("header_image")}
          variant={"ghost"}
          size="sm"
        >
          <BiSolidDockTop size={20} />
          <span>Upload header image</span>
        </Button>
        <Button
          className="space-x-2 justify-start"
          onClick={() => handleClick("background_image")}
          variant={"ghost"}
          size="sm"
        >
          <PiSelectionBackground size={20} />
          <span>Upload background image</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
