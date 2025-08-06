
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getQuiz, saveQuizResult } from '@/lib/firestore';
import { type Quiz } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

type SelectedAnswers = {
  [key: string]: number;
};

export default function QuizResultsPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuizAndCalcResults = async () => {
      try {
        const quizData = await getQuiz(quizId);
        if (!quizData) {
          notFound();
          return;
        }
        setQuiz(quizData);

        const storedAnswers = localStorage.getItem(`quiz-${quizData.id}-answers`);
        if (storedAnswers) {
          const parsedAnswers: SelectedAnswers = JSON.parse(storedAnswers);
          setSelectedAnswers(parsedAnswers);

          let correctCount = 0;
          quizData.questions.forEach((q) => {
            if (parsedAnswers[q.id] === q.correctAnswer) {
              correctCount++;
            }
          });
          const calculatedScore = Math.round((correctCount / quizData.questions.length) * 100);
          setScore(calculatedScore);

          if (user) {
             await saveQuizResult(user.uid, {
                quizId: quizData.id,
                quizTitle: quizData.title,
                subject: quizData.subject,
                score: calculatedScore,
             });
          }
        }
      } catch (error) {
         console.error("Error loading quiz results: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizAndCalcResults();
  }, [quizId, user]);

  if (loading) {
    return <div>Loading results...</div>;
  }
  
  if (!quiz || selectedAnswers === null) {
    return <div>Could not load quiz results. Please try taking the quiz again.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Award className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>You finished the {quiz.title}.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-primary">{score}%</p>
          <p className="text-muted-foreground mt-2">
            You answered {quiz.questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} out of {quiz.questions.length} questions correctly.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Review Your Answers</h2>
      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const userAnswer = selectedAnswers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;
          return (
            <Card key={question.id} className={isCorrect ? 'border-green-500/50' : 'border-red-500/50'}>
              <CardHeader>
                <CardTitle className="flex items-start gap-4">
                    {isCorrect ? <CheckCircle className="text-green-500 h-6 w-6 shrink-0 mt-1" /> : <XCircle className="text-red-500 h-6 w-6 shrink-0 mt-1" />}
                    <span>{index + 1}. {question.text}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-12 space-y-2">
                {question.options.map((option, optIndex) => {
                  const isUserAnswer = optIndex === userAnswer;
                  const isCorrectAnswer = optIndex === question.correctAnswer;
                  let className = "text-muted-foreground";
                  if (isUserAnswer && isCorrectAnswer) className = "text-green-400 font-bold";
                  else if (isUserAnswer && !isCorrectAnswer) className = "text-red-400 font-bold line-through";
                  else if (isCorrectAnswer) className = "text-green-400 font-bold";

                  return (
                    <p key={optIndex} className={className}>
                      {option}
                      {isUserAnswer && isCorrectAnswer && ' (Your correct answer)'}
                      {isUserAnswer && !isCorrectAnswer && ' (Your answer)'}
                      {!isUserAnswer && isCorrectAnswer && ' (Correct answer)'}
                    </p>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
       <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link href="/quizzes">Take Another Quiz</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
