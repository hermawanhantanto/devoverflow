import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import NoResult from "@/components/shared/NoResult";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import {
  formatAndDivideNumber,
  getTimestamp,
  stripHtmlTags,
} from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    filter: string;
  };
}

const QuestionDetail = async ({ params, searchParams }: Props) => {
  const { userId: clerkId } = auth();

  let user;

  if (clerkId) {
    user = await getUserById({ userId: clerkId });
  }

  const question = await getQuestionById({ questionId: params.id });

  if (!question)
    return (
      <div>
        <h1 className="h1-bold text-dark300_light700">All Users</h1>
        <div className="mt-36 flex w-full flex-col items-center justify-center">
          <NoResult
            title="No details question"
            description="Try searching for something else"
            link="/"
            linkTitle="Go back home"
          />
        </div>
      </div>
    );
  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row sm:items-center">
        <Link
          className="flex w-full items-center gap-2"
          href={`/profile/${question.author.clerkId}`}
        >
          <Image
            src={question.author.picture}
            width={22}
            height={22}
            className="rounded-full"
            alt="user"
          />
          <p className="text-dark300_light700 paragraph-medium">
            {question.author.name}
          </p>
        </Link>
        <div className="max-sm:self-end">
          <Votes
            type="question"
            itemId={JSON.stringify(question._id)}
            userId={JSON.stringify(user._id)}
            upvotes={question.upvotes.length}
            downvotes={question.downvotes.length}
            hasUpVoted={question.upvotes.includes(user._id)}
            hasDownVoted={question.downvotes.includes(user._id)}
            hasSaved={user.saved.includes(question._id)}
          />
        </div>
      </div>
      <h2 className="h2-bold text-dark200_light800 mt-4 capitalize">
        {question.title}
      </h2>
      <div className="my-8 flex flex-wrap items-center gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock"
          value={`asked ${getTimestamp(question.createdAt)}`}
          title="created"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={question.content} />
      <div className="mt-4 flex items-center gap-4">
        {question.tags.map((tag: any) => (
          <RenderTag key={tag.id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <AllAnswers
        questionId={JSON.stringify(question._id)}
        filter={searchParams.filter}
      />
      <Answer
        userId={JSON.stringify(user._id)}
        questionId={JSON.stringify(question._id)}
        question={stripHtmlTags(question.content)}
      />
    </>
  );
};

export default QuestionDetail;
