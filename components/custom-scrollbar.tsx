"use client";
import React, { useEffect } from "react";
import style from "@/components/css/scrollbar.module.css";
import { useCommunity } from "@/store/use-community";

const CustomScrollBar = ({
  modalRef,
}: // modalRef,
{
  modalRef: React.RefObject<HTMLDivElement>;
}) => {
  const { community } = useCommunity();
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      let th = 0;
      let ph = 0;
      if (modalRef.current) {
        th = modalRef.current.scrollHeight - window.innerHeight;
        ph = (modalRef.current.scrollTop / th) * 100;
      }
      if (ref.current) {
        ref.current.style.height = ph + "%";
        if (community.background_color)
          ref.current.style.background = community.interactive_elements_color;
      }
    };
    let clean = modalRef.current;
    modalRef.current?.addEventListener("scroll", onScroll);
    return () => clean?.removeEventListener("scroll", onScroll);
  }, [modalRef, community]);
  return (
    <div
      className={style.scrollbar}
      style={{ background: community.interactive_elements_color + "50" }}
    >
      <div ref={ref}></div>
    </div>
  );
};

export default CustomScrollBar;
