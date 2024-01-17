import { getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface Props {
  _id: string;
  answer: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

const RenderAnswer = ({
  _id,
  answer,
  createdAt,
  upvotes,
  downvotes,
  author,
  hasUpVoted,
  hasDownVoted,
}: Props) => {
  return (
    <div className="light-border-2 flex w-full flex-col border-b py-8">
      <div className="mb-4 flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <Link
          href={`/profile/${author.clerkId}`}
          className="flex items-center gap-2"
        >
          <Image
            src={author.picture}
            width={22}
            height={22}
            className="rounded-full"
            alt="user"
          />
          <div className="flex max-sm:flex-col sm:items-center sm:gap-2">
            <p className="paragraph-semibold text-dark300_light700">
              {author.name}
            </p>
            <span className="small-regular text-light-500">{`answered ${getTimestamp(
              createdAt
            )}`}</span>
          </div>
        </Link>
        <div className="self-end">
          <Votes
            type="answer"
            itemId={JSON.stringify(_id)}
            userId={JSON.stringify(author._id)}
            upvotes={upvotes}
            downvotes={downvotes}
            hasUpVoted={hasUpVoted}
            hasDownVoted={hasDownVoted}
          />
        </div>
      </div>
      <ParseHTML data={answer} />
    </div>
  );
};

export default RenderAnswer;
