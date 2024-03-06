import React, { ChangeEvent, FormEvent, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Community } from "@prisma/client";
import { getContrastYIQ } from "@/lib/yiq";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { TypeImageUpload } from "@/types";
import CommunityButton from "@/components/community/button-community";

interface Props {
  open: boolean;
  type: TypeImageUpload;
  community: Community;
  close: () => void;
}

export default function UploadImage({ open, type, close, community }: Props) {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(error);

    if (!file || !type) return;
    const formData = new FormData();

    formData.set("file", file);
    formData.set("type", type);

    startTransition(async () => {
      const res = await fetch(`/api/r/${community.name}/image`, {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      if (text && res.status > 400) {
        setError(text);
      } else {
        router.refresh();
        onClose();
      }
    });
  }

  function onClose() {
    setImage("");
    setError("");
    setFile(undefined);
    close();
  }

  let image_classname = "";

  if (type === "avatar") {
    image_classname = " w-60 h-60 rounded-full";
  } else if (type === "background_image") {
    image_classname = " w-60 h-60";
  } else if (type === "header_image") {
    image_classname = " w-60 h-24 ";
  }

  if (type) if (!open) return null;
  return (
    <div className=" fixed z-[999] bg-black/50 w-full h-full top-0 left-0 flex items-center justify-center">
      <Card className="relative">
        <CardHeader>
          <button className="absolute top-2 right-2" onClick={onClose}>
            <MdClose size={20} />
          </button>
          <Label className="hover:cursor-pointer" htmlFor="file">
            Upload
          </Label>
          <Input
            type="file"
            id="file"
            className="hover:cursor-pointer flex pt-1.5"
            onChange={handleChange}
          />
        </CardHeader>
        <CardContent className=" flex justify-center">
          {/* <div className="overflow-hidden rounded-full w-20 h-20"> */}
          {image && (
            <div className={cn(" relative overflow-hidden", image_classname)}>
              <Image
                fill
                // objectFit="cover"
                src={image}
                alt={type ?? "image"}
                className="w-full object-cover"
              />
            </div>
          )}
          {/* </div> */}
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          {error && !isPending && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-x-2 ">
            <Button variant={"ghost"} onClick={onClose} type="button">
              Cancel
            </Button>
            <CommunityButton type="submit" disabled={isPending || !image}>
              {isPending ? (
                <Loader
                  color={getContrastYIQ(community.interactive_elements_color)}
                  width={20}
                />
              ) : (
                "Upload"
              )}
            </CommunityButton>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
