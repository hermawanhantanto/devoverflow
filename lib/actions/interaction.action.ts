"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";


export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId } = params;
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    if (userId) {
      const interaction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (interaction) return console.log("Already viewed");

      await Interaction.create({
        user: userId,
        question: questionId,
        action: "view",
      });
    }
  } catch (error) {
    console.log(error);
  }
}
