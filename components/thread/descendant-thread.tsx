import { NestedThread } from "@/types";
import DescendantCard from "@/components/thread/descendant-card";
import { ContinueThread } from "./continue-thread";

interface Props {
  thread: NestedThread[];
}

export default function DescendantThread({ thread }: Props) {
  if (thread.length === 0) {
    return;
  }

  return (
    <>
      {thread.map((t) => {
        return (
          <div className="relative bg-white pt-1" key={t.id}>
            <DescendantCard thread={t} />
            <ContinueThread thread={t} />
          </div>
        );
      })}
    </>
  );
}
