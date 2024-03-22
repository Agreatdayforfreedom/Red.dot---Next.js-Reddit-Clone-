"use client";
import React, { useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThreadSchema } from "@/schemas/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import { createPost, updatePost } from "@/lib/actions";
import { Thread } from "@/types";

import { InputCommunity } from "../community/input-community";

export default function FormNewPost({
  userId,
  thread,
}: {
  userId: string;
  thread?: Thread;
}) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const params = useSearchParams();
  const form = useForm<Partial<z.infer<typeof ThreadSchema>>>({
    resolver: zodResolver(
      ThreadSchema.partial({ id: true, parent_id: true, userId: true })
    ),
    defaultValues: {
      title: thread?.title ? thread.title : "",
      content: thread?.content ? thread.content : "",
      communityId: params.get("c") ?? "",
    },
  });
  let text: string = thread ? "Update" : "Create";

  function onSubmit(values: Omit<Partial<z.infer<typeof ThreadSchema>>, "id">) {
    setError("");
    startTransition(() => {
      if (thread) {
        //!UPDATE
        if (
          values.content === thread.content &&
          values.title === thread.title
        ) {
          return console.log("lol change the content");
        }
        updatePost({ ...values, parent_id: null, id: thread.id }, userId).then(
          (res) => {
            if (res?.error) setError(res.error);
          }
        );
      } else {
        //!CREATE
        createPost({ ...values, parent_id: null }, userId).then((res) => {
          if (res?.error) setError(res.error);
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full px-10 space-x-1 space-y-1"
      >
        <InputCommunity form={form} />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input className="rounded-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea className="rounded-sm h-48" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end items-center space-x-1">
          {error && <p className="text-red-500 mr-10">{error}</p>}

          <Button disabled={isPending} type="submit">
            {isPending ? <Loader width={25} /> : text}
          </Button>
        </div>
      </form>
    </Form>
  );
}
