import React, { Suspense } from "react";
import { IoIosLogOut } from "react-icons/io";

import { signOut } from "@/auth";
import Saved from "@/components/saved";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "@/components/ui/button";

export default async function PrivateHeader() {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger>
          <Button variant={"secondary"}>Posts Saved</Button>
        </PopoverTrigger>

        <PopoverContent>
          <Suspense fallback={<p>loading</p>}>
            <Saved />
          </Suspense>
        </PopoverContent>
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
