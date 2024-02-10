import React from "react";
import Modal from "@/app/(index)/@modal/modal";
import ThreadSection from "@/components/thread/thread-section";
import { getThread } from "@/lib/actions";
import currentUser from "@/lib/currentUser";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();

  const [thread] = await getThread(params.id, user?.id!);
  if (!thread) return notFound();
  return (
    <Modal>
      <ThreadSection thread={thread} intercepted={true} />
    </Modal>
  );
}
