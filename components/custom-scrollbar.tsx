"use client";
import React, { useEffect } from "react";
import style from "@/components/css/scrollbar.module.css";

const CustomScrollBar = ({
  modalRef,
}: // modalRef,
{
  modalRef: React.RefObject<HTMLDivElement>;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      let th = 0;
      let ph = 0;
      if (modalRef.current) {
        th = modalRef.current.scrollHeight - window.innerHeight;
        ph = (modalRef.current.scrollTop / th) * 100;
      }
      if (ref.current) ref.current.style.height = ph + "%";
    };
    let clean = modalRef.current;
    modalRef.current?.addEventListener("scroll", onScroll);
    return () => clean?.removeEventListener("scroll", onScroll);
  }, [modalRef]);
  return (
    <div className={style.scrollbar}>
      <div ref={ref}></div>
    </div>
  );
};

export default CustomScrollBar;
