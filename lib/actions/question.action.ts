"use server";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 10, searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, `i`) } },
        { content: { $regex: new RegExp(searchQuery, `i`) } },
      ];
    }

    let sort = {};

    if (filter) {
      if (filter === "newest") {
        sort = {
          createdAt: -1,
        };
      } else if (filter === "recommended") {
        sort = {};
      } else if (filter === "frequent") {
        sort = {
          upvotes: -1,
          views: -1,
        };
      } else if (filter === "unanswered") {
        if (searchQuery) {
          query.$or = [
            { title: { $regex: new RegExp(searchQuery, `i`) } },
            { content: { $regex: new RegExp(searchQuery, `i`) } },
            { answers: { $size: 0 } },
          ];
        } else {
          query.$or = [{ answers: { $size: 0 } }];
        }
      }
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Question.countDocuments(query);

    return { questions, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    if (params.questionId.length !== 24) return;
    const question = await Question.findById(params.questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    if (!question) return;
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      question: question._id,
      action: "create-question",
      tags: tagDocuments,
    });
    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
    revalidatePath(path);
  } catch (error) {}
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(
      { _id: questionId },
      updateQuery,
      {
        new: true,
      }
    );

    if (!question) return;

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    const question = await Question.findById(questionId);
    if (!question) return;

    if (hasupVoted) {
      await Question.updateOne(
        { _id: question._id },
        { $pull: { upvotes: userId } }
      );
      await Question.updateOne(
        { _id: question._id },
        { $push: { downvotes: userId } }
      );
      if (question.author !== userId) {
        await User.findByIdAndUpdate(question.author, {
          $inc: { reputation: -2 },
        });
        await User.findByIdAndUpdate(userId, { $inc: { reputation: -1 } });
      }
      return revalidatePath(path);
    }

    if (hasdownVoted) {
      await Question.updateOne(
        { _id: question._id },
        { $pull: { downvotes: userId } }
      );
      if (question.author !== userId) {
        await User.findByIdAndUpdate(question.author, {
          $inc: { reputation: +2 },
        });
        await User.findByIdAndUpdate(userId, { $inc: { reputation: +1 } });
        await Interaction.findOneAndDelete({
          userId,
          question: questionId,
          action: "downvote-question",
        });
      }
      return revalidatePath(path);
    }

    await Question.updateOne(
      { _id: question._id },
      { $push: { downvotes: userId } }
    );
    if (question.author !== userId) {
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: -2 },
      });
      await User.findByIdAndUpdate(userId, { $inc: { reputation: -1 } });
      await Interaction.create({
        userId,
        question: questionId,
        action: "downvote-question",
      });
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    const tags = await Tag.find({ questions: { $in: [questionId] } });

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag.name}$`, "i") } },
        { $pull: { questions: questionId } }
      );
      if (!existingTag.questions) {
        await Tag.findOneAndDelete({ _id: existingTag._id });
      }
    }

    await User.updateMany(
      { saved: { $in: [questionId] } },
      { $pull: { saved: questionId } }
    );

    await Question.findByIdAndDelete(questionId);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, title, content, tags, path } = params;
    const question = await Question.findById(questionId);

    if (!question) throw new Error("Error");

    question.title = title;
    question.content = content;
    question.tags = [];

    const existingTags = await Tag.find({ questions: { $in: [questionId] } });
    for (const tag of existingTags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag.name}$`, "i") },
        },
        {
          $pull: { questions: questionId },
        }
      );

      if (!existingTag.questions) {
        await Tag.findOneAndDelete({ _id: existingTag._id });
      }
    }

    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    question.save();
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();
    const questions = await Question.find()
      .sort({ upvotes: -1, views: -1 })
      .limit(5);

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecommendationQuestion(params: RecommendedParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!userId) {
      throw new Error("User not found");
    }

    const skipAmount = (page - 1) * pageSize;

    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }

      return tags;
    }, []);

    const distinctUserTagsId = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagsId } },
        { author: { $ne: user._id } },
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, `i`) } },
        { content: { $regex: new RegExp(searchQuery, `i`) } },
      ];
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ upvotes: -1, views: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const total = await Question.countDocuments(query);

    return { questions, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
