import React, { ChangeEvent, useState, useTransition } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import CommunityButton from "@/components/community/button-community";
import { Community } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getContrastYIQ } from "@/lib/yiq";
import Loader from "@/components/loader";

interface Props {
  community: Community;
  close: () => void;
}

export default function ColorPickers({ close, community }: Props) {
  const [background, setBackground] = useState(community.background_color);
  const [linkColor, setLinkColor] = useState(
    community.interactive_elements_color
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    //todo
    startTransition(async () => {
      await axios.put(`/api/r/${community.name}/colors`, {
        background_color: background,
        interactive_elements_color: linkColor,
      });
      router.refresh();
      close();
    });
  }

  function handleClose() {
    close();
  }

  return (
    <div className="fixed z-[999]  w-full h-full bg-black/50 top-0 left-0 flex justify-center items-center">
      {/* <Card className="flex flex-col md:flex-row md:w-4/5 md:space-x-2 z-[999] space-x-0 space-y-4 md:space-y-0 mx-auto justify-between"> */}
      <Card className=" p-2 w-fit  flex flex-col items-end space-y-3 ">
        <button onClick={handleClose}>
          <MdClose size={20} />
        </button>
        <div className="flex space-x-2 flex-col mx-5">
          <div>
            <p className="text-lg">Pick a Backgound</p>
          </div>
          <Popover>
            <PopoverTrigger className="h-9">
              <div
                className="w-7 h-7 rounded-full shadow-[0_0_1px_1px_rgba(0,0,0,0.3)]"
                style={{ background }}
              ></div>
            </PopoverTrigger>
            <PopoverContent className="z-[999] w-auto h-auto p-0 border-none">
              <HexColorPicker color={background} onChange={setBackground} />
            </PopoverContent>
          </Popover>
          <Input
            name="background_color"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBackground(e.target.value)
            }
            value={background}
          />
        </div>

        <div className="flex space-x-2 items-start flex-col mx-5">
          <p className="text-lg">Community Links Color</p>

          <Popover>
            <PopoverTrigger className="h-9">
              <div
                className="w-7 h-7 rounded-full  shadow-[0_0_1px_1px_rgba(0,0,0,0.3)]"
                style={{ background: linkColor }}
              ></div>
            </PopoverTrigger>
            <PopoverContent className="z-[999] w-auto h-auto p-0 border-none">
              <HexColorPicker color={linkColor} onChange={setLinkColor} />
            </PopoverContent>
          </Popover>
          <div className="w-full">
            <Input
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLinkColor(e.target.value)
              }
              value={linkColor}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant={"ghost"} disabled={isPending} onClick={handleClose}>
            Cancel
          </Button>
          <CommunityButton
            disabled={
              isPending ||
              (background === community.background_color &&
                linkColor === community.interactive_elements_color)
            }
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader
                color={getContrastYIQ(community.interactive_elements_color)}
                width={20}
              />
            ) : (
              "Upload"
            )}
          </CommunityButton>
        </div>
      </Card>
    </div>
  );
}
