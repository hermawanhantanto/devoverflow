"use client";
import { AnswersSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "../ui/form";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "../ui/use-toast";

interface Props {
  questionId: string;
  question: string;
  userId: string;
}

const Answer = ({ questionId, question, userId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const form = useForm<z.infer<typeof AnswersSchema>>({
    resolver: zodResolver(AnswersSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AnswersSchema>) {
    try {
      setIsSubmitting(true);

      await createAnswer({
        author: JSON.parse(userId),
        question: JSON.parse(questionId),
        content: values.answer,
        path: pathname,
      });
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
      toast({
        title: "Success",
        description: "Answer successfully submitted",
      });
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAnswerAI = async () => {
    try {
      setIsSubmittingAI(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify(question),
        }
      );
      const body = await response.json();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(body.reply.replace(/\n/g, "<br/>"));
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h3 className="h3-bold text-dark300_light700">Write the answer here</h3>
        <Button
          onClick={handleAnswerAI}
          className="light-border-2 btn items-center gap-1.5 rounded-md px-4 py-2.5 !text-primary-500 shadow-none"
        >
          <Image
            src="/assets/icons/stars.svg"
            width={20}
            height={20}
            className="object-contain"
            alt="stars"
          />
          {isSubmittingAI ? "Loading..." : "Generate Answer from AI"}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }: any) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue=""
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "default",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="btn primary-gradient text-white"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
