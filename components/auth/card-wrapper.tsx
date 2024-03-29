import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import React from "react";
import Logo from "../logo";

interface Props {
  children: React.ReactNode;
  title: string;
  linkHref: string;
  linkLabel: string;
}

function CardWrapper({ children, ...props }: Props) {
  return (
    <Card className="w-[400px]">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Logo />
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center">
        <Link href={props.linkHref} className="cursor-pointer hover:underline">
          {props.linkLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}

export default CardWrapper;
