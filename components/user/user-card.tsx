import React, { Suspense } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoIosLogOut, IoIosArrowDown } from "react-icons/io";

import { signOut } from "@/auth";
import Saved from "@/components/saved";
import currentUser from "@/lib/currentUser";
import Image from "next/image";

export default async function UserCard() {
  const user = await currentUser();
  if (!user) return;
  return (
    <Popover>
      <PopoverTrigger>
        <div className=" flex items-center justify-between w-40 h-10 border rounded px-3">
          <div className="flex items-center">
            <div className="relative w-6 h-6">
              <Image
                fill
                src={user?.image || ""}
                alt={user?.name || "username"}
                className="rounded"
              />
            </div>
            <div className="mx-1 text-xs flex flex-col items-start justify-center h-full">
              <p className="whitespace-nowrap overflow-hidden max-w-[88px]">
                {user.name}
              </p>
              <p className="font-semibold text-slate-500">1 karma</p>
            </div>
          </div>
          <IoIosArrowDown />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-40 p-0">
        <div className="flex flex-col items-center space-y-2 ">
          <Popover>
            <PopoverTrigger className="px-3 py-2 mt-2 hover:bg-slate-100 rounded-none w-full">
              Posts Saved
            </PopoverTrigger>

            <Suspense fallback={<p>loading</p>}>
              <PopoverContent side="left" align="start">
                <Saved />
              </PopoverContent>
            </Suspense>
          </Popover>
          <form
            className="border-t w-full flex items-center justify-center py-3"
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="flex items-center space-x-1 hover:text-orange-700"
            >
              <IoIosLogOut size={20} />
              <span>Log out</span>
            </button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
