"use client";
import React, { ReactNode, useEffect, useTransition } from "react";
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
import Loader from "@/components/loader";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useIntercept } from "@/store/use-intercept";
import axios from "axios";
import CommunityButton from "@/components/community/button-community";
import { NestedThread } from "../../types";

interface Props {
  threadId: string;
  optimisticUpdate?: (
    type: "UPDATE" | "CREATE" | "DELETE",
    data: Partial<NestedThread> | null
  ) => void;
  label?: string | ReactNode[];
  openable?: boolean;
  content?: string;
  onReply?: () => void;
}

export default function ThreadForm({
  threadId,
  optimisticUpdate,
  content,
  label,
  openable = false,
  onReply,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { intercepted } = useIntercept();

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

          if (intercepted) {
            if (optimisticUpdate) {
              optimisticUpdate("UPDATE", {
                content: values.content,
                title: null,
              });
            }
            await axios.put(`/api/r/thread/${threadId}/edit`, {
              content: values.content,
              title: null,
            });
          } else {
            await updateSubThread(
              {
                title: null,
                content: values.content,
                id: threadId,
              },
              user.id
            );
          }
        } else {
          //! CREATE
          if (intercepted) {
            const { data } = await axios.post("/api/r/thread/create", {
              title: null,
              content: values.content,
              parent_id: threadId,
            });

            if (optimisticUpdate) optimisticUpdate("CREATE", data.data);
            // router.refresh();
          } else {
            await newSubThread(
              {
                title: null,
                content: values.content,
                parent_id: threadId,
              },
              user.id
            );
          }
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
        className="relative px-10 space-x-1 space-y-1 mt-5"
      >
        {onReply && <ThreadLine static_line />}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Textarea className="rounded-sm text-black" {...field} />
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
          <CommunityButton
            disabled={isPending}
            type="submit"
            className="p-3 h-7 text-xs"
          >
            {isPending ? <Loader width={20} /> : text}
          </CommunityButton>
        </div>
      </form>
    </Form>
  );
}
