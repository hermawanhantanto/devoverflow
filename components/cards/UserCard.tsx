import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const tags = await getTopInteractedTags({ userId: user._id });
  return (
    <div className="background-light900_dark200 flex flex-col items-center justify-center rounded-lg max-xl:px-4 max-xl:py-8 max-xs:max-w-full xs:max-w-[260px] xl:p-8">
      <Link
        href={`/profile/${user.clerkId}`}
        className="flex w-full flex-col items-center justify-center gap-3"
      >
        <Image
          src={user.picture}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-full"
        />
        <h3 className="h3-semibold text-dark200_light900 line-clamp-1">
          {user.name}
        </h3>
        <span className="body-regular dark:text-light-500">
          @{user.username}
        </span>
      </Link>
      <div className="mt-4 flex items-center gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag.id} _id={tag.id} name={tag.name} />
        ))}
      </div>
    </div>
  );
};

export default UserCard;
