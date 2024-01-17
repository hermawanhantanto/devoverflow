import { getAllAnswers } from "@/lib/actions/answer.action";
import React from "react";
import RenderAnswer from "./RenderAnswer";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";

interface Props {
  questionId: string;
  filter: string;
}

const AllAnswers = async ({ questionId, filter }: Props) => {
  const result = await getAllAnswers(
    { questionId: JSON.parse(questionId), sortBy:  filter}
    
    );
  return (
    <div className="mt-8 flex w-full flex-col gap-12">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="primary-text-gradient h3-bold">{`${result.answers.length} Answers`}</h3>
        <Filter filters={AnswerFilters} />
      </div>
      {result.answers.map((answer) => (
        <RenderAnswer
          key={answer._id}
          _id={answer._id}
          answer={answer.content}
          createdAt={answer.createdAt}
          upvotes={answer.upvotes.length}
          downvotes={answer.downvotes.length}
          author={answer.author}
          hasUpVoted={answer.upvotes.includes(answer.author._id)}
          hasDownVoted={answer.downvotes.includes(answer.author._id)}
        />
      ))}
    </div>
  );
};

export default AllAnswers;
