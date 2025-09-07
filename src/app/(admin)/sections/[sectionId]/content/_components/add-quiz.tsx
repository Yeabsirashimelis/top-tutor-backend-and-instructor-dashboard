"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { z } from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

import { quizQuestionSchema, quizSchema } from "@/types/types";
import { useAddQuiz } from "../_hooks/section-lecture-hooks";

type QuestionForm = z.infer<typeof quizQuestionSchema>;

const AddQuiz = () => {
  const { sectionId } = useParams();
  const { toast } = useToast();
  const { mutate: addQuiz, isPending } = useAddQuiz();

  // Form for quiz metadata
  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      order: 1,
      sectionId: sectionId as string,
      questions: [],
    },
  });

  const [questions, setQuestions] = useState<QuestionForm[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`quiz-questions-${sectionId}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuestionForm>({
    questionText: "",
    order: 1,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    explanation: "",
  });

  // Load saved questions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`quiz-questions-${sectionId}`);
    if (saved) setQuestions(JSON.parse(saved));
  }, [sectionId]);

  // Save questions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      `quiz-questions-${sectionId}`,
      JSON.stringify(questions)
    );
  }, [questions, sectionId]);

  const addQuestion = () => {
    // Validation: question text required
    if (!currentQuestion.questionText.trim()) {
      toast({
        title: "Validation Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    // Validation: at least one correct option
    if (!currentQuestion.options.some((opt) => opt.isCorrect)) {
      toast({
        title: "Validation Error",
        description: "Please mark at least one option as correct",
        variant: "destructive",
      });
      return;
    }

    // Validation: unique order
    if (questions.some((q) => q.order === currentQuestion.order)) {
      toast({
        title: "Validation Error",
        description: `Question order ${currentQuestion.order} already exists`,
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = quizQuestionSchema.parse(currentQuestion);
      setQuestions((prev) => [...prev, parsed]);

      // Reset current question
      setCurrentQuestion({
        questionText: "",
        order: parsed.order + 1, // auto-increment order
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        explanation: "",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: err.errors.map((e) => e.message).join(", "),
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = () => {
    if (questions.length === 0) {
      toast({
        title: "No Questions",
        description: "Please add at least one question",
        variant: "destructive",
      });
      return;
    }

    const quizData = {
      title: form.getValues("title"),
      order: form.getValues("order"),
      sectionId: sectionId as string,
      questions,
    };

    addQuiz(quizData, {
      onSuccess: () => {
        toast({
          title: "Quiz Added",
          description: `${quizData.title} was added successfully`,
        });
        setQuestions([]);
        localStorage.removeItem(`quiz-questions-${sectionId}`);
        form.reset({ title: "", order: 1, sectionId: sectionId as string });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="w-[90%] md:w-[60%] shadow-md">
      <CardHeader>
        <CardTitle>Add Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            {/* Quiz Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. React Basics Quiz" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quiz Order */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Input */}
            <div className="p-2 border rounded-md space-y-2">
              <h3 className="font-bold">Add Question</h3>
              <Input
                placeholder="Question Text"
                value={currentQuestion.questionText}
                onChange={(e) =>
                  setCurrentQuestion((q) => ({
                    ...q,
                    questionText: e.target.value,
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Question Order"
                value={currentQuestion.order}
                onChange={(e) =>
                  setCurrentQuestion((q) => ({
                    ...q,
                    order: Number(e.target.value),
                  }))
                }
              />
              {currentQuestion.options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Option ${idx + 1}`}
                    value={opt.text}
                    onChange={(e) =>
                      setCurrentQuestion((q) => {
                        const newOpts = [...q.options];
                        newOpts[idx].text = e.target.value;
                        return { ...q, options: newOpts };
                      })
                    }
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        setCurrentQuestion((q) => {
                          const newOpts = [...q.options];
                          newOpts[idx].isCorrect = e.target.checked;
                          return { ...q, options: newOpts };
                        })
                      }
                    />
                    Correct
                  </label>
                  {currentQuestion.options.length > 2 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setCurrentQuestion((q) => {
                          const newOpts = q.options.filter((_, i) => i !== idx);
                          return { ...q, options: newOpts };
                        })
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                onClick={() =>
                  setCurrentQuestion((q) => ({
                    ...q,
                    options: [...q.options, { text: "", isCorrect: false }],
                  }))
                }
              >
                + Option
              </Button>

              <Input
                placeholder="Explanation (optional)"
                value={currentQuestion.explanation}
                onChange={(e) =>
                  setCurrentQuestion((q) => ({
                    ...q,
                    explanation: e.target.value,
                  }))
                }
              />
              <Button type="button" onClick={addQuestion}>
                Add Question
              </Button>
            </div>

            {/* Display Questions */}
            {/* Display Questions */}
            <div className="space-y-2 mt-4">
              <h3 className="font-bold">Questions Added</h3>
              {questions.map((q, idx) => (
                <Card key={idx} className="p-2 border flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>
                        <strong>Q{idx + 1}:</strong> {q.questionText} (Order:{" "}
                        {q.order})
                      </p>
                      <ul className="list-disc ml-5">
                        {q.options.map((opt, i) => (
                          <li key={i}>
                            {opt.text} {opt.isCorrect && "(Correct)"}
                          </li>
                        ))}
                      </ul>
                      {q.explanation && (
                        <p className="text-sm text-gray-600">
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </div>
                    {/* Remove Question button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setQuestions((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <CardFooter className="flex justify-end px-0 mt-4">
              <Button type="button" onClick={onSubmit} disabled={isPending}>
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Quiz
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddQuiz;
