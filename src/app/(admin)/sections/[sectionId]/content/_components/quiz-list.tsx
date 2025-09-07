"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGetQuizzes } from "../_hooks/section-lecture-hooks";
import { useParams } from "next/navigation";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  order: number;
  options: Option[];
  explanation?: string;
}

interface Quiz {
  _id: string;
  title: string;
  order: number;
  questions: Question[];
}

const QuizList = () => {
  const { sectionId } = useParams();
  const {
    data: quizzes = [],
    isLoading,
    isError,
  } = useGetQuizzes(sectionId as string);
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<
    number | null
  >(null);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-4">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );

  if (isError) return <p className="text-red-500">Failed to load quizzes.</p>;

  return (
    <div className="space-y-4 mt-6">
      {quizzes.map((quiz) => (
        <Card key={quiz._id} className="p-2 border">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => {
              if (!quiz._id) return;
              setExpandedQuizId(expandedQuizId === quiz._id ? null : quiz._id);
            }}
          >
            <p className="font-bold text-lg">
              {quiz.title} (Order: {quiz.order})
            </p>
            {expandedQuizId === quiz._id ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>

          {expandedQuizId === quiz._id && (
            <div className="mt-2 space-y-2">
              {quiz.questions
                .sort((a, b) => a.order - b.order)
                .map((q, idx) => (
                  <Card key={idx} className="p-2 border">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setExpandedQuestionIndex(
                          expandedQuestionIndex === idx ? null : idx
                        )
                      }
                    >
                      <p>
                        <strong>Q{q.order}:</strong> {q.questionText}
                      </p>
                      {expandedQuestionIndex === idx ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>

                    {expandedQuestionIndex === idx && (
                      <div className="mt-2 space-y-2">
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
                    )}
                  </Card>
                ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default QuizList;
