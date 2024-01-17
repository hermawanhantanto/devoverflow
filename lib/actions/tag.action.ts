import User from "@/database/user.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    return [
      { id: "1", name: "Javascript" },
      { id: "2", name: "React" },
      { id: "3", name: "NextJS" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, `i`) } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = {
          questions: -1,
        };
        break;
      case "recent":
        sortOptions = {
          createdOn: -1,
        };
        break;
      case "name":
        sortOptions = {
          name: 1,
        };
        break;
      case "old":
        sortOptions = {
          createdOn: 1,
        };
        break;
      default:
        break;
    }
    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const total = await Tag.countDocuments(query);

    return { tags, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagIdParams(
  params: GetQuestionsByTagIdParams
) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, `i`) } },
        { content: { $regex: new RegExp(searchQuery, `i`) } },
      ];
    }
    const tags = await Tag.findById(tagId).populate({
      path: "questions",
      match: query,
      options: {
        sort: { createdOn: -1 },
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name clerkId picture" },
      ],
    });

    query.tags = tagId;
    const total = await Question.countDocuments(query);
    const tagsQuestions = tags.questions;
    return { questions: tagsQuestions, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotTags() {
  try {
    connectToDatabase();
    const tags = await Tag.aggregate([
      { $project: { name: 1, count: { $size: "$questions" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
