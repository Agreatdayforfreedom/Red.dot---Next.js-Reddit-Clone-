import React, { ChangeEvent, useEffect, useState, useTransition } from "react";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { HexColorPicker } from "react-colorful";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { MdClose } from "react-icons/md";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { getContrastYIQ } from "@/lib/yiq";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommunitySchema } from "@/schemas/community";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Loader from "../loader";

interface Props {
  closeModal: () => void;
  open: boolean;
}

export default function FormNewCommunity({ closeModal, open }: Props) {
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [background, setBackground] = useState("#ffffff");
  const [linkColor, setLinkColor] = useState("#000000");

  const form = useForm<z.infer<typeof CommunitySchema>>({
    resolver: zodResolver(CommunitySchema),
    defaultValues: {
      name: "",
      info: "",
      background_color: "#ffffff",
      background_image: "",
      interactive_elements_color: "#000000",
    },
  });

  function onSubmit(values: z.infer<typeof CommunitySchema>) {
    setError("");
    values.background_color = background;
    values.interactive_elements_color = linkColor;
    startTransition(async () => {
      try {
        const { data } = await axios.post("/api/r/create", values);
        router.push(`/r/${data}`);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data);
        }
      }
    });
  }

  function onCloseModal() {
    closeModal();
  }
  if (!open) return null;
  return (
    <div className="fixed z-[999] bg-black/50 w-full h-full top-0 left-0 flex items-center justify-center">
      <Card
        className=" w-3/4 rounded space-y-5 max-h-screen overflow-y-auto no-scrollbar bg-white"
        style={{ border: `1px solid ${background}` }}
      >
        <CardHeader
          className="space-y-0 p-3 border-b border-slate-200 flex flex-row justify-between items-center"
          style={{ background, color: getContrastYIQ(background) }}
        >
          <CardTitle>Create a community</CardTitle>
          <button onClick={onCloseModal}>
            <MdClose size={20} className="group-hover:hover:fill-red-500" />
          </button>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-lg">Name</FormLabel>
                    <FormDescription>
                      Community names cannot be changed.
                    </FormDescription>
                    <FormControl>
                      <div>
                        <span className="relative top-[30px] left-2 text-slate-500">
                          r/
                        </span>
                        <Input
                          {...field}
                          disabled={isPending}
                          className="px-5"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="info"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-lg">Info</FormLabel>
                    <FormDescription>Community information</FormDescription>
                    <FormControl>
                      <div>
                        <Textarea {...field} disabled={isPending} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* pick colors */}
              <div className="flex flex-col md:flex-row md:w-4/5 md:space-x-2 space-x-0 space-y-4 md:space-y-0 mx-auto justify-between">
                <FormField
                  control={form.control}
                  name="background_color"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-lg">
                        Pick a Backgound
                      </FormLabel>
                      <FormDescription>
                        Choose the background color of your community!
                      </FormDescription>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Popover>
                            <PopoverTrigger className="h-9">
                              <div
                                className="w-7 h-7 rounded-full shadow-[0_0_1px_1px_rgba(0,0,0,0.3)]"
                                style={{ background }}
                              ></div>
                            </PopoverTrigger>
                            <PopoverContent className="z-[999] w-auto h-auto p-0 border-none">
                              <HexColorPicker
                                color={background}
                                onChange={setBackground}
                              />
                            </PopoverContent>
                          </Popover>
                          <Input
                            {...field}
                            name="background_color"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setBackground(e.target.value)
                            }
                            value={background}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interactive_elements_color"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-lg">
                        Community Links Color
                      </FormLabel>
                      <FormDescription>
                        Choose the color of the community links{" "}
                      </FormDescription>

                      <FormControl>
                        <div className="flex space-x-2 items-start">
                          <Popover>
                            <PopoverTrigger className="h-9">
                              <div
                                className="w-7 h-7 rounded-full  shadow-[0_0_1px_1px_rgba(0,0,0,0.3)]"
                                style={{ background: linkColor }}
                              ></div>
                            </PopoverTrigger>
                            <PopoverContent className="z-[999] w-auto h-auto p-0 border-none">
                              <HexColorPicker
                                color={linkColor}
                                onChange={setLinkColor}
                              />
                            </PopoverContent>
                          </Popover>
                          <div className="w-full">
                            <Input
                              {...field}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setLinkColor(e.target.value)
                              }
                              value={linkColor}
                            />
                            <span
                              className="flex hover:underline hover:cursor-pointer"
                              style={{ color: linkColor }}
                            >
                              r/{form.watch("name")}
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end items-center space-x-4">
                {error && <p className="text-red-500">{error}</p>}
                <div className="space-x-2">
                  <Button
                    variant={"ghost"}
                    disabled={isPending}
                    onClick={onCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{
                      background: linkColor,
                      color: getContrastYIQ(linkColor),
                    }}
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader width={20} color={getContrastYIQ(linkColor)} />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
