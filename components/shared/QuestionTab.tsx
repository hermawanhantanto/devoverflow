import { getUserQuestions } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props {
  userId: string;
  page: number;
}

const QuestionTab = async ({ userId, page }: Props) => {
  const { questions, total } = await getUserQuestions({
    userId,
    page,
  });

  if (!questions) return null;

  return (
    <div className="mt-6 flex flex-col gap-6">
      {questions.map((question) => (
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
      {total > 10 && (
        <div className="flex-center">
          <Pagination currentPage={page} pageSize={10} itemCount={total} />
        </div>
      )}
    </div>
  );
};

export default QuestionTab;
