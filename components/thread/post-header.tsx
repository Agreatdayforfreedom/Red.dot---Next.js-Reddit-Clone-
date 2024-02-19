import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

interface Props {
  username: string;
  created_at: Date;
  community?: {
    name?: string | null;
    avatar?: string | null;
  };
}

export default function PostHeader({ username, created_at, community }: Props) {
  const router = useRouter();
  function handleNavigate(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    router.push(`/r/${community?.name}`);
  }

  return (
    <div className="flex items-center text-xs ml-1 space-x-1 ">
      {community?.name && (
        <div className="flex items-center">
          {community.avatar && (
            <div className="relative w-5 h-5 mr-1">
              <Image
                fill
                src={community.avatar}
                alt="community avatar"
                className="object-cover rounded-full"
              />
            </div>
          )}
          <button
            onClick={handleNavigate}
            className="font-semibold hover:underline"
          >
            r/{community.name}
          </button>
          <span className="text-slate-500 pl-1"> &#183; </span>
        </div>
      )}
      <p className="text-slate-500 ">
        Posted by
        <span className="pl-1 hover:underline hover:cursor-pointer">
          u/{username}
        </span>
      </p>
      {/* <span className="text-slate-500 px-1"> &#183; </span> */}
      <p className="text-slate-500">
        {moment(created_at, "YYYYMMDD").fromNow()}
      </p>
    </div>
  );
}
