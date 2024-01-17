"use client";
import { getGlobalSearch } from "@/lib/actions/generall.action";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ParseHTML from "../ParseHTML";
import GlobalFilter from "./GlobalFilter";

interface IResult {
  type: string;
  title: string;
  id: string;
}

const GlobalResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IResult[]>([]);
  const searchParams = useSearchParams();
  const global = searchParams.get("global");
  const type = searchParams.get("type");


  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        const res = await getGlobalSearch({
          type: type || "",
          query: global || "",
        });
        setResult(JSON.parse(res));
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [type, global]);

  const renderLink = (type: string, id: string) => {
    if (type === "user") {
      return `/profile/${id}`;
    }
    if (type === "tag") {
      return `/tags/${id}`;
    }
    if (type === "question") {
      return `/question/${id}`;
    }
    if (type === "answer") {
      return `/question/${id}`;
    }

    return "/";
  };
  return (
    <div className="absolute top-full z-10 mt-5 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <div className="flex w-full items-center">
        <p className="text-dark400_light900 body-regular px-5">Filters</p>
        <GlobalFilter />
      </div>
      <div className="my-5 h-[1px]  bg-light-700/50" />
      <div className="flex flex-col space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex-center w-full flex-col">
            <ReloadIcon className="mt-5 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark400_light900 body-regular mt-2 px-5">
              Browse the whole of database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {result.length > 0 ? (
              result.map((item: IResult, index: number) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={(item.type, item.id, index)}
                  className="flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 hover:bg-light-700 dark:hover:bg-dark-300"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                    alt="tag"
                  />
                  <div className="flex flex-col">
                    <p className="text-dark200_light800 body-medium line-clamp-1">
                      <ParseHTML data={item.title} />
                    </p>
                    <p className="text-dark200_light800 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col ">
                <p className="text-dark200_light800 body-medium mt-2">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
