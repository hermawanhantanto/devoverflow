"use client";
import { Input } from "@/components/ui/input";
import { formUrlQueryParams, removeUrlQueryParams } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQueryParams({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl);
      } else {
        const newUrl = removeUrlQueryParams({
          params: searchParams.toString(),
          keysToRemove: ["q"],
        });
        router.push(newUrl);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
