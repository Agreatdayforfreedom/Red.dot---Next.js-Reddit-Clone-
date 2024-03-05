import React from "react";
import Modal from "@/app/@modal/modal";
import ThreadSection from "@/components/thread/thread-section";
import { getCommunity, getThread } from "@/lib/actions";
import { notFound } from "next/navigation";
import currentUser from "@/lib/currentUser";

export default async function Page({ params }: { params: { id: string } }) {
  const [thread] = await getThread(params.id);
  const user = await currentUser();
  if (!thread) return notFound();
  const community = await getCommunity(thread.communityId ?? "");
  return (
    <Modal>
      <ThreadSection
        username={user?.name || ""}
        community={community}
        thread={thread}
        intercepted={true}
      />
    </Modal>
  );
}
