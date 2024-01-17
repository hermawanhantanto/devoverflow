"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { saveQuestion } from "@/lib/actions/user.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { useEffect } from "react";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasUpVoted,
  hasDownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    try {
      await saveQuestion({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        path: pathname,
      });
      if (hasSaved) {
        return toast({
          title: "Success remove save the question",
          variant: "destructive",
        });
      }
      toast({
        title: "Success save the question",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const handleVote = async (action: string) => {
    try {
      if (type === "question" && userId) {
        if (action === "upvote") {
          await upvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted: hasUpVoted,
            hasdownVoted: hasDownVoted,
            path: pathname,
          });
          if (hasUpVoted) {
            return toast({
              title: "Success remove upvote the question",
              variant: "destructive",
            });
          }
          return toast({
            title: "Success upvote the question",
          });
        }
        if (action === "downvote") {
          await downvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted: hasUpVoted,
            hasdownVoted: hasDownVoted,
            path: pathname,
          });
          if (hasDownVoted) {
            return toast({
              title: "Success remove downvote the question",
              variant: "destructive",
            });
          }
          return toast({
            title: "Success downvote the question",
          });
        }
      }
      if (type === "answer" && userId) {
        if (action === "upvote") {
          await upvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted: hasUpVoted,
            hasdownVoted: hasDownVoted,
            path: pathname,
          });
          if (hasUpVoted) {
            return toast({
              title: "Success remove upvote the answer",
              variant: "destructive",
            });
          }
          return toast({
            title: "Success upvote the answer",
          });
        }
        if (action === "downvote") {
          await downvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted: hasUpVoted,
            hasdownVoted: hasDownVoted,
            path: pathname,
          });
          if (hasDownVoted) {
            return toast({
              title: "Success remove downvote the answer",
              variant: "destructive",
            });
          }
          return toast({
            title: "Success downvote the answer",
          });
        }
      }
      return toast({
        title: "You need to login to vote",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
   
  }, [userId, itemId, router, pathname]);

  return (
    <div className="flex items-center gap-2">
      <Button
        className="flex items-center gap-1.5 p-1"
        onClick={() => handleVote("upvote")}
      >
        {hasUpVoted ? (
          <Image
            src="/assets/icons/upvoted.svg"
            width={22}
            height={22}
            alt="upvoted"
          />
        ) : (
          <Image
            src="/assets/icons/upvote.svg"
            width={22}
            height={22}
            alt="upvote"
          />
        )}
        <span className="subtle-medium text-dark400_light700 p-1 dark:bg-dark-400">
          {upvotes}
        </span>
      </Button>
      <Button
        className="flex items-center gap-1.5 p-1"
        onClick={() => handleVote("downvote")}
      >
        {hasDownVoted ? (
          <Image
            src="/assets/icons/downvoted.svg"
            width={22}
            height={22}
            alt="downvoted"
            className="object-contain"
          />
        ) : (
          <Image
            src="/assets/icons/downvote.svg"
            width={22}
            height={22}
            alt="downvote"
            className="object-contain"
          />
        )}
        <span className="subtle-medium text-dark400_light700 bg-light-700 p-1 dark:bg-dark-400">
          {downvotes}
        </span>
      </Button>
      {type === "question" && (
        <Image
          src={`/assets/icons/${hasSaved ? `star-filled.svg` : `star-red.svg`}`}
          width={22}
          height={22}
          alt="save"
          className="ml-2 cursor-pointer object-contain"
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};

export default Votes;
