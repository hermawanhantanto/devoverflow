import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async ({ params }: URLProps) => {
  const { userId } = auth();

  let mongoUser;

  if (userId) {
    mongoUser = await getUserById({ userId });
  }

  const { title, content, tags } = await getQuestionById({
    questionId: params.id,
  });

  const tagss = tags.map((tag: any) => tag.name);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit a question</h1>
      <div className="mt-9">
        <Question
          mongoUserId={JSON.stringify(mongoUser._id)}
          title={title}
          content={content}
          id={JSON.stringify(params.id)}
          tags={tagss}
          type="edit"
        />
      </div>
    </div>
  );
};

export default Page;
