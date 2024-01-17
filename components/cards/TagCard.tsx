import React from "react";
import Link from "next/link";

interface Props {
  tag: {
    id: string;
    name: string;
    questions: [];
  };
}

const TagCard = ({ tag }: Props) => {
  return (
    <Link
      className="background-light900_dark300 rounded-xl p-8 shadow-light-100 dark:shadow-none max-xs:min-w-full xs:max-w-[260px]"
      href={`/tags/${tag.id}`}
    >
      <p className="body-semibold text-dark200_light900 background-light800_dark400 line-clamp-1 w-fit px-6 py-2">
        {tag.name}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <p className="body-semibold text-primary-500">
          {tag.questions.length}+
        </p>
        <span className="small-regular dark:text-light-500">Questions</span>
      </div>
    </Link>
  );
};

export default TagCard;
