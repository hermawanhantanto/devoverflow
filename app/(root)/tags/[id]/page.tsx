import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionsByTagIdParams } from "@/lib/actions/tag.action";
import React from "react";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    q: string;
    page: string;
  };
}

const Page = async ({ params, searchParams }: Props) => {
  const result = await getQuestionsByTagIdParams({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Saved Questions</h1>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.map((question: any) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes.length}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))}
      </div>
      <div className="mt-12 flex items-center justify-center">
        <Pagination
          currentPage={searchParams.page ? +searchParams.page : 1}
          itemCount={result.total}
          pageSize={10}
        />
      </div>
    </>
  );
};

export default Page;
