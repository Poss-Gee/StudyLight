
'use client';

import { getQuiz } from '@/lib/firestore';
import { type Quiz } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { QuizClient } from '@/components/quiz-client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const quizData = await getQuiz(quizId);
        if (!quizData) {
          notFound();
        } else {
          setQuiz(quizData);
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-between">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        </div>
    )
  }
  
  if (!quiz) {
    return notFound();
  }

  return <QuizClient quiz={quiz} />;
}
