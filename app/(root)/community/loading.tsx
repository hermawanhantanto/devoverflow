import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark300_light700">All Users</h1>
      <div className="flex w-full flex-col">
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <Skeleton className="h-14 flex-1" />

          <Skeleton className="h-14 w-28" />
        </div>

        <div className="mt-12 flex w-full flex-wrap gap-4">
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
          <Skeleton className="h-56 w-56 rounded-xl" />
        </div>
      </div>
    </section>
  );
};

export default Loading;
