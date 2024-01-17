"use server";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;

    const answer = await Answer.create({
      author,
      question,
      content,
    });

    const questionDetail = await Question.findOneAndUpdate(
      { _id: question },
      { $push: { answers: answer._id } }
    );

    await Interaction.create({
      user: author,
      question,
      answer: answer._id,
      action: "create-answer",
      tags: questionDetail.tags,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId, sortBy } = params;

    let sortOptions = {};
    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = {
          upvotes: -1,
        };
        break;
      case "lowestUpvotes":
        sortOptions = {
          upvotes: 1,
        };
        break;
      case "recent":
        sortOptions = {
          createdAt: -1,
        };
        break;
      case "old":
        sortOptions = {
          createdAt: 1,
        };
        break;
      default:
        break;
    }
    const answers = await Answer.find({ question: questionId })
      .populate({ path: "author", model: "User" })
      .populate({ path: "question", model: "Question" })
      .sort(sortOptions);
    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(
      { _id: answerId },
      updateQuery,
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });
    await User.findByIdAndUpdate(answer._id, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

     await Answer.findByIdAndUpdate(
      { _id: answerId },
      updateQuery,
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? 2 : -2 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, path } = params;
    const answer = await Answer.findById({ _id: answerId });
    if (!answer) {
      throw new Error("Answer not found");
    }
    await Question.updateOne(
      {
        answers: { $in: [answerId] },
      },
      {
        $pull: { answers: answerId },
      }
    );
    await Interaction.deleteMany({ answer: answerId });
    await Answer.findOneAndDelete({ _id: answerId });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
