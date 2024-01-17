"use client";

import { HomePageFilters } from "@/constants/filters";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQueryParams, removeUrlQueryParams } from "@/lib/utils";

const HomeFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("filter");

  const [filter, setFilter] = useState(query || "");

  useEffect(() => {
    if (filter) {
      const newUrl = formUrlQueryParams({
        params: searchParams.toString(),
        key: "filter",
        value: filter,
      });
      router.push(newUrl);
    } else {
      const newUrl = removeUrlQueryParams({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
      router.push(newUrl);
    }
  }, [router, pathname, filter, query, searchParams]);

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {
            setFilter(filter === item.value ? "" : item.value);
          }}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            filter === item.value
              ? "bg-primary-100  text-primary-500  dark:bg-dark-300"
              : "bg-light-800 text-light-500 dark:bg-dark-300"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
