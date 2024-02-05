"use client";
import React, { useEffect, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import ThreadLine from "@/components/thread/threadline";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ThreadChildSchema } from "@/schemas/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { newSubThread, updateSubThread } from "@/lib/actions";
import { usePathname } from "next/navigation";
import Loader from "@/components/loader";
import useCurrentUser from "@/hooks/useCurrentUser";

interface Props {
  threadId: string;
  label?: string;
  openable?: boolean;
  content?: string;
  onReply?: () => void;
}

export default function ThreadForm({
  threadId,
  content,
  label,
  openable = false,
  onReply,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const user = useCurrentUser();
  const form = useForm<Pick<z.infer<typeof ThreadChildSchema>, "content">>({
    resolver: zodResolver(
      ThreadChildSchema.required({ content: true }).partial()
    ),
    defaultValues: {
      content: content ? content : "",
    },
  });
  let text: string = content ? "Update" : "Reply";

  const onSubmit = (values: { content: string }) => {
    startTransition(async () => {
      if (user?.id)
        if (content) {
          //! UPDATE

          if (values.content === content) {
            return console.log("lol change the content");
          }
          await updateSubThread(
            {
              title: null,
              content: values.content,
              id: threadId,
            },
            user.id,
            pathname
          );
        } else {
          //! CREATE
          await newSubThread(
            {
              title: null,
              content: values.content,
              parent_id: threadId,
            },
            user.id,
            pathname
          );
        }
      form.reset();
      if (onReply) onReply();
    });
  };

  if (!user) return null;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative px-10 space-x-1 space-y-1"
      >
        {onReply && <ThreadLine static_line />}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Textarea className="rounded-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-1">
          {openable && (
            <Button
              type="button"
              className="p-3 h-7 text-xs"
              variant={"ghost"}
              onClick={onReply}
            >
              Cancel
            </Button>
          )}
          <Button
            disabled={isPending}
            type="submit"
            className="p-3 h-7 text-xs"
          >
            {isPending ? <Loader width={20} /> : text}
          </Button>
        </div>
      </form>
    </Form>
  );
}
