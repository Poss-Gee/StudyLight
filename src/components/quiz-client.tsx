'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz, Question } from '@/lib/dummy-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type SelectedAnswers = {
  [key: string]: number;
};

export function QuizClient({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  
  const question = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem(`quiz-${quiz.id}-answers`, JSON.stringify(selectedAnswers));
    router.push(`/quizzes/${quiz.id}/results`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{quiz.title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg font-semibold">{question.text}</p>
            <RadioGroup
              onValueChange={(value) => handleSelectAnswer(question.id, parseInt(value))}
              value={selectedAnswers[question.id]?.toString()}
              className="space-y-2"
            >
              {question.options.map((option, index) => (
                <Label
                  key={index}
                  htmlFor={`${question.id}-${index}`}
                  className={`flex items-center space-x-3 p-4 rounded-md border transition-colors cursor-pointer ${selectedAnswers[question.id] === index ? 'border-primary bg-primary/10' : 'border-border'}`}
                >
                  <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                  <span>{option}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit}>Submit Quiz</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
