"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQueryParams, removeUrlQueryParams } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
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

      router.push(newUrl, { scroll: false });
    }
  }, [pathname, filter, query, searchParams, router]);

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={(e) => setFilter(e)}>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="background-light800_dark300 text-dark500_light700 border-none">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
