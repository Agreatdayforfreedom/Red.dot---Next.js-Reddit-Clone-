"use client";
import { Community } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import UploadImage from "./upload_image";

export default function Avatar({ community }: { community: Community }) {
  const [openUpload, setOpenUpload] = useState(false);
  const onClick = () => {
    setOpenUpload(true);
  };
  return (
    <div className="group relative">
      <UploadImage
        open={openUpload}
        close={() => setOpenUpload(false)}
        community={community}
        type="avatar"
      />
      <Image
        src={community.avatar ?? ""}
        alt={community.name}
        className="rounded-full w-[80px] h-[80px]"
        width={80}
        height={80}
      />
      <button
        onClick={onClick}
        className="absolute flex items-center justify-center border-2 border-black bottom-0 right-0 none h-6 w-6 rounded-full bg-white opacity-0 group-hover:block group-hover:opacity-100 z-10"
      >
        <AiOutlinePlus size={20} />
      </button>
    </div>
  );
}
