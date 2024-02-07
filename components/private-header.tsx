import React, { Suspense } from "react";
import { IoIosLogOut } from "react-icons/io";

import { signOut } from "@/auth";
import Saved from "@/components/saved";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default async function PrivateHeader() {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger className="px-3 py-2 bg-slate-100 rounded">
          Posts Saved
        </PopoverTrigger>

        <Suspense fallback={<p>loading</p>}>
          <PopoverContent>
            <Saved />
          </PopoverContent>
        </Suspense>
      </Popover>
      <form
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
  );
}
