"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import useCurrentUser from "@/hooks/useCurrentUser";
import ButtonCreateCommunity from "@/components/community/button-create-community";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

export default function HomeBanner() {
  return (
    <Card className="rounded">
      <CardHeader className="relative h-[34px] p-0">
        <Image
          fill
          src="/img/home/home-banner.png"
          className="object-fill"
          alt="banner"
        />
      </CardHeader>
      <CardContent className="p-0 px-1 mx-1 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-[68px]">
            <Image
              fill
              src="/img/home/guy-home.png"
              alt="guy"
              className="!-top-3.5"
            />
          </div>
          <h2>Home</h2>
        </div>
        <p className="p-2 text-sm text-slate-700 leading-snug text-pretty">
          “We are like butterflies who flutter for a day and think it is
          forever.”
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 p-3">
        <Button className="w-full rounded-full" asChild>
          <Link href="/submit">New Post</Link>
        </Button>
        <ButtonCreateCommunity />
      </CardFooter>
    </Card>
  );
}
