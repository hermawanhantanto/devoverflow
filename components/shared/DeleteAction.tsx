"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { deleteQuestion } from "@/lib/actions/question.action";

interface Props {
  id: string;
  type: string;
}

const DeleteAction = ({ id, type }: Props) => {
  const path = usePathname();
  const onClick = async (id: string) => {
    try {
      if (type === "answer") {
        await deleteAnswer({
          answerId: JSON.parse(id),
          path,
        });
      }
      if (type === "question") {
        await deleteQuestion({
          questionId: JSON.parse(id),
          path,
        });
      }
      toast({
        title: "Delete success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Delete failed",
      });
    }
  };
  return (
    <Button className="p-0" onClick={() => onClick(id)}>
      <Image
        src="/assets/icons/trash.svg"
        width={18}
        height={18}
        alt="delete"
      />
    </Button>
  );
};

export default DeleteAction;
