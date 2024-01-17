"use client";
import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQueryParams, removeUrlQueryParams } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import { useState } from "react";

const GlobalFilter = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const query = searchParams.get("type");
  const [filter, setFilter] = useState(query || "");

  const handleFilter = (type: string) => {
    if (filter === type) {
      setFilter("");
      const newUrl = removeUrlQueryParams({
        params: searchParams.toString(),
        keysToRemove: ["type"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setFilter(type);
      const newUrl = formUrlQueryParams({
        params: searchParams.toString(),
        key: "type",
        value: type,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex w-full items-center gap-3">
      {GlobalSearchFilters.map((item) => (
        <Button
          className={`flex w-fit items-center justify-center rounded-full px-5 ${
            filter === item.value
              ? "bg-primary-500 text-light-900"
              : "text-dark200_light800 bg-light-700 dark:bg-dark-200"
          }`}
          key={item.value}
          onClick={() => handleFilter(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default GlobalFilter;
