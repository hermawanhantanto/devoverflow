"use server";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";

// import { FilterQuery } from "mongoose";

// interface GlobalSearchParams {
//   type?: string;
//   searchQuery: string;
// }

// interface Result {
//   type: string;
//   id: string;
//   title: string;
// }

// export async function getGlobalSearchResult(params: GlobalSearchParams) {
//   try {
//     connectToDatabase();

//     const { type, searchQuery } = params;

//     const queryQuestion: FilterQuery<typeof Question> = {};
//     const queryUser: FilterQuery<typeof User> = {};
//     const queryTag: FilterQuery<typeof Tag> = {};
//     const queryAnswer: FilterQuery<typeof Answer> = {};
//     let result: Result[] = [];

//     if (searchQuery) {
//       queryQuestion.$or = [
//         { title: { $regex: new RegExp(searchQuery, "i") } },
//         { content: { $regex: new RegExp(searchQuery, "i") } },
//       ];
//       queryAnswer.$or = [{ content: { $regex: new RegExp(searchQuery, "i") } }];
//       queryUser.$or = [
//         { name: { $regex: new RegExp(searchQuery, "i") } },
//         { username: { $regex: new RegExp(searchQuery, "i") } },
//       ];
//       queryTag.$or = [{ name: { $regex: new RegExp(searchQuery, `i`) } }];
//     }

//     const modelInfo = [
//       { model: Question, query: queryQuestion, type: "question" },
//       { model: Answer, query: queryAnswer, type: "answer" },
//       { model: User, search: queryUser, type: "user" },
//       { model: Tag, search: queryTag, type: "tag" },
//     ];

//     const index = modelInfo.findIndex((item) => item.type === type);

//     if (type) {
//       const query = modelInfo[index].query || {};
//       const res = await modelInfo[index].model.find(query);
//       const updateResult = res.map((item) => {
//         const updatedItem = {
//           type,
//           id: String(item._id),
//           title: item.title || "",
//         };

//         if (type === "answer") {
//           updatedItem.title = item.content;
//           updatedItem.id = String(item.question._id);
//         }
//         if (type === "tag" || type === "user") {
//           updatedItem.title = item.name;
//           if (type === "user") {
//             updatedItem.id = String(item.clerkId);
//           }
//         }

//         return updatedItem;
//       });

//       return JSON.stringify(updateResult);
//     } else {
//       for (const model of modelInfo) {
//         const query = model.query || {};
//         const res = await model.model.find(query).limit(2);
//         const updateResult: Result[] = res.map((item) => {
//           const updatedItem = {
//             id: String(item._id),
//             type: model.type,
//             title: item.title || "",
//           };

//           if (model.type === "answer") {
//             updatedItem.title = item.content;
//             updatedItem.id = String(item.question._id);
//           }
//           if (model.type === "tag" || model.type === "user") {
//             updatedItem.title = item.name;
//             if (model.type === "user") {
//               updatedItem.id = String(item.clerkId);
//             }
//           }

//           return updatedItem;
//         });

//         result = [...result, ...updateResult];
//       }

//       return JSON.stringify(result);
//     }
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function getGlobalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;
    const regex = { $regex: query, $options: "i" };
    let results = [];

    const modelType = [
      {
        model: Question,
        searchField: "title",
        type: "question",
      },
      {
        model: Answer,
        searchField: "content",
        type: "answer",
      },
      {
        model: User,
        searchField: "name",
        type: "user",
      },
      {
        model: Tag,
        searchField: "name",
        type: "tag",
      },
    ];

    const typeLower = type?.toLocaleLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      for (const { model, searchField, type } of modelType) {
        const queryResult = await model
          .find({
            [searchField]: regex,
          })
          .limit(2);

        results.push(
          ...queryResult.map((item: any) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question._id
                : item._id,
          }))
        );
      }
    } else {
      const modelInfo = modelType.find((item) => item.type === typeLower);

      if (!modelInfo) {
        throw new Error("Model not found");
      }

      const queryResult = await modelInfo.model
        .find({
          [modelInfo.searchField]: regex,
        })
        .limit(8);

      results = queryResult.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question._id
            : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
