import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import Metric from "./Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import Pagination from "./Pagination";
import { SignedIn } from "@clerk/nextjs";
import DeleteAction from "./DeleteAction";

interface Props {
  userId: string;
  page: number;
}

const AnswerTabs = async ({ userId, page }: Props) => {
  const { total, answers } = await getUserAnswers({
    userId,
    page,
  });

  if (!answers) return null;

  return (
    <div className="flex flex-col gap-6 mt-6">
      {answers.map((answers) => (
        <div
          className="card-wrapper rounded-[10px] p-9 sm:px-11"
          key={answers._id}
        >
          <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
            <div>
              <Link href={`/question/${answers.question._id}`}>
                <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                  {answers.question.title}
                </h3>
              </Link>
            </div>

            {/* If signed in add edit delete actions */}

            <SignedIn>
              <DeleteAction id={JSON.stringify(answers._id)} type="answer" />
            </SignedIn>
          </div>
          <div className="flex-between mt-6 w-full flex-wrap gap-3">
            <Metric
              imgUrl={answers.author.picture}
              alt="user"
              value={answers.author.name}
              title={` - asked ${getTimestamp(answers.question.createdAt)}`}
              href={`/profile/${answers.author._id}`}
              isAuthor
              textStyles="body-medium text-dark400_light700"
            />

            <Metric
              imgUrl="/assets/icons/like.svg"
              alt="Upvotes"
              value={formatAndDivideNumber(answers.upvotes.length)}
              title=" Votes"
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </div>
      ))}
      {total > 10 && (
        <div className="flex-center">
          <Pagination currentPage={page} pageSize={10} itemCount={total} />
        </div>
      )}
    </div>
  );
};

export default AnswerTabs;
