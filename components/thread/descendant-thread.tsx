import { NestedThread } from "@/types";
import DescendantCard from "@/components/thread/descendant-card";
import { User } from "@prisma/client";
interface Props {
  thread: NestedThread[];
  user: User | undefined;
}
export default function DescendantThread({ thread, user }: Props) {
  return (
    // <div className="bg-white">
    <>
      {thread.map((t) => {
        return (
          <div className="relative" key={t.id}>
            <DescendantCard thread={t} user={user} />
          </div>
        );
      })}
    </>
    // </div>
  );
}
