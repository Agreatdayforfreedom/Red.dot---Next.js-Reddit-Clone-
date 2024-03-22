"use client";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ThreadSchema } from "@/schemas/thread";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Community, Join_User_Community } from "@prisma/client";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";

interface Props {
  form: UseFormReturn<Partial<z.infer<typeof ThreadSchema>>>;
}

export const InputCommunity = ({ form }: Props) => {
  const user = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // if (!isMounted) return null;
  if (!user || !isMounted)
    return (
      <div>
        <Label>Community</Label>
        <div className="border rounded-sm py-1 px-2 mt-2 flex space-x-2 items-center">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-40 h-4 rounded-full" />
        </div>
      </div>
    );
  return (
    <FormField
      control={form.control}
      name="communityId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Community</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <div className="relative">
                <SelectTrigger>
                  <SelectValue placeholder="Select a community"></SelectValue>
                </SelectTrigger>
              </div>
            </FormControl>
            <SelectContent className="p-2 space-y-2">
              {user.communities?.map(
                (c: Join_User_Community & { community: Community }) => (
                  <SelectItem id={c.community.id} value={c.community.name}>
                    <div className="flex space-x-2 hover:bg-slate-200 cursor-pointer p-1 rounded-sm">
                      <div className="relative w-6 h-6 ">
                        <Image
                          fill
                          className="rounded-full"
                          src={c.community.avatar!}
                          alt="community avatar"
                        />
                      </div>
                      <p>{c.community.name}</p>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
