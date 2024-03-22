import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { getContrastYIQ } from "@/lib/yiq";
import { useCommunity } from "@/store/use-community";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {
  children: React.ReactNode;
  background?: string;
}
export default function CommunityButton({
  children,
  background,
  ...props
}: Props) {
  const { community } = useCommunity();
  if (!community) return null;
  const color = background
    ? background
    : community.interactive_elements_color
    ? community.interactive_elements_color
    : undefined;

  const target = props.variant === "outline" ? "borderColor" : "background";

  return (
    <Button
      style={
        color
          ? {
              [target]: color,
              color: target === "background" ? getContrastYIQ(color) : color,
            }
          : {}
      }
      // onClick={onClickCreatePost}
      {...props}
    >
      {children}
    </Button>
  );
}
