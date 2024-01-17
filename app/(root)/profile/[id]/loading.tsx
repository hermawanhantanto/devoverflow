import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex flex-col-reverse justify-between sm:flex-row ">
        <div className="flex gap-4 max-sm:flex-col sm:items-center">
          <Skeleton className="h-[140px] w-[140px] rounded-full" />

          <div className="flex flex-col">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="mt-4 h-8 w-36" />

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="mt-4 h-8 w-36" />
          </div>
        </div>
        <div className="max-sm:mb-4 max-sm:self-end">
          <Skeleton className=" min-h-[46px] min-w-[170px] px-6 py-3" />
        </div>
      </div>
      <div className="mt-10 flex w-full gap-6">
        <Skeleton className="h-48 w-64" />
        <Skeleton className="h-48 w-64" />
        <Skeleton className="h-48 w-64" />
        <Skeleton className="h-48 w-64" />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </>
  );
};

export default Loading;
