"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQueryParams, removeUrlQueryParams } from "@/lib/utils";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("global");
  const [search, setSearch] = useState(query || "");

  const container = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        container.current &&
        // @ts-ignore
        !container.current.contains(event.target)
      ) {
        setSearch("");
      }
    };

    setSearch("");
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [pathname]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQueryParams({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeUrlQueryParams({
          params: searchParams.toString(),
          keysToRemove: ["global", "type"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, search, router, pathname, searchParams]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={container}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="paragraph-regular text-dark400_light700 no-focus placeholder border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {search !== "" && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
