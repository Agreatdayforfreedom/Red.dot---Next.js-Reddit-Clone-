import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/loader";

export default function ThreadSkeleton() {
  return (
    <div className=" bg-stone-900">
      <div className=" bg-white w-5/6 h-lvh flex flex-col justify-around mx-auto ">
        <div className="mx-5">
          <div className="  space-y-1">
            <div className="flex items-center space-x-1">
              <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
              <Skeleton className="w-40 h-5"></Skeleton>
            </div>
            <Skeleton className="w-80 h-6 "></Skeleton>
            <Skeleton className="w-96 h-5 "></Skeleton>
          </div>
          {/* actions */}
          <div className="mt-5 flex space-x-1 items-center">
            <Skeleton className="w-8 h-8 rounded-full"></Skeleton>
            <Skeleton className="w-16 h-7 rounded"></Skeleton>
            <Skeleton className="w-16 h-7 rounded"></Skeleton>
          </div>
        </div>
        <hr />
        <div className="w-full flex justify-center">
          <Loader width={30} />
        </div>
      </div>
    </div>
  );
}
