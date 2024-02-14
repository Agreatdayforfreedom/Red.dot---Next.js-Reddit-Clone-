"use client";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { PiSelectionBackground } from "react-icons/pi";
import { HiMiniPaintBrush } from "react-icons/hi2";
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
import ColorPickers from "./color-pickers";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function UpdatePopover({ community }: { community: Community }) {
  const [openUpload, setOpenUpload] = useState(false);
  const [openChangeColors, setChangeColors] = useState(false);
  const [type, setType] = useState<TypeImageUpload>();
  const user = useCurrentUser();
  function handleClick(t: typeof type) {
    setOpenUpload(true);
    setType(t);
  }

  if (openChangeColors) {
    return (
      <ColorPickers
        close={() => setChangeColors(false)}
        community={community}
      />
    );
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
  if (!user) return null;
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
        <Button
          className="space-x-2 justify-start"
          onClick={() => setChangeColors(true)}
          variant={"ghost"}
          size="sm"
        >
          <HiMiniPaintBrush size={20} />
          <span>Change colors</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
