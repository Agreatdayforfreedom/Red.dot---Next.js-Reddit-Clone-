"use client";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import CustomScrollBar from "@/components/custom-scrollbar";

export default function Modal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const router = useRouter();
  function onDismiss() {
    router.back();
  }

  function onStop(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    e.stopPropagation();
  }
  return (
    <div className="fixed bg-black/50 top-0 z-50 w-full" onClick={onDismiss}>
      <div
        className="bg-white h-screen w-11/12 mx-auto relative"
        onClick={(e) => onStop(e)}
      >
        <div
          ref={ref}
          className=" max-h-screen my-0 overflow-y-auto no-scrollbar"
        >
          <CustomScrollBar modalRef={ref} />
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
