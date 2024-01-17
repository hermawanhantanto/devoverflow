"use server";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
  getQuestionsByUserIdParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";
import { handleBadges } from "../utils";

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, searchQuery, filter } = params;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, `i`) } },
        { username: { $regex: new RegExp(searchQuery, `i`) } },
      ];
    }

    let sort = {};

    switch (filter) {
      case "new_users":
        sort = {
          joinedAt: -1,
        };
        break;
      case "old_users":
        sort = {
          joinedAt: 1,
        };
        break;
      case "top_contributors":
        sort = {
          reputation: -1,
        };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const total = await User.countDocuments(query);

    return { users, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function saveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId, path } = params;
    const user = await User.findById(userId);
    const hasSaved = user.saved.includes(questionId);

    if (hasSaved) {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { saved: questionId } }
      );
    } else {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    return revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const { clerkId } = params;
    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, `i`) } },
        { content: { $regex: new RegExp(searchQuery, `i`) } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = {
          createdAt: -1,
        };
        break;
      case "oldest":
        sortOptions = {
          createdAt: 1,
        };
        break;
      case "most_voted":
        sortOptions = {
          upvotes: -1,
        };
        break;
      case "most_viewed":
        sortOptions = {
          views: -1,
        };
        break;
      case "most_answered":
        sortOptions = {
          answers: -1,
        };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    query.author = user._id;
    const total = await Question.countDocuments(query);
    if (!user) throw new Error("User not found");
    const savedQuestions = user.saved;
    return { questions: savedQuestions, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (user) {
      const question = await Question.countDocuments({ author: user._id });
      const answer = await Answer.countDocuments({ author: user._id });

      // const [questionUpvotes] = await Question.aggregate([
      //   { $match: { author: user._id } },
      //   {
      //     $project: {
      //       _id: 0,
      //       upvotes: { $size: "$upvotes" },
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: null,
      //       totalUpvotes: { $sum: "$upvotes" },
      //     },
      //   },
      // ]);

      const [questionViews] = await Question.aggregate([
        { $match: { author: user._id } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$views" },
          },
        },
      ]);

      const { gold, silver, bronze } = handleBadges({
        sumOfQuestion: question,
        sumOfViews: questionViews.totalViews,
      });

      return { user, question, answer, gold, silver, bronze };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: getQuestionsByUserIdParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const questions = await Question.find({ author: userId })
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort({ views: -1, upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Question.countDocuments({ author: userId });

    return { questions, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    const total = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .populate({
        path: "question",
        model: Question,
        select: "_id title createdAt",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return { total, answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
