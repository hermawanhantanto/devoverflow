"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { formUrlQueryParams } from "@/lib/utils";

interface Props {
  currentPage: number;
  itemCount: number;
  pageSize: number;
}

const Pagination = ({ currentPage, itemCount, pageSize }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageCount = Math.ceil(itemCount / pageSize);

  const handleOnChange = (page: number) => {
    const newUrl = formUrlQueryParams({
      params: searchParams.toString(),
      key: "page",
      value:  page.toString()
    })

    router.push(newUrl)
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        className="background-light700_dark300 text-dark400_light800 flex h-[32px] items-center justify-center px-6 py-3"
        onClick={() => handleOnChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>
      <div className="flex h-[32px] items-center justify-center rounded bg-primary-500 p-4 text-white">
        {currentPage}
      </div>
      <Button
        className="background-light700_dark300 text-dark400_light800 flex h-[32px] items-center justify-center px-6 py-3"
        onClick={() => handleOnChange(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
