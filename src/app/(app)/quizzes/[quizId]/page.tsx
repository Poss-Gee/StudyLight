import { quizzes } from '@/lib/dummy-data';
import { notFound } from 'next/navigation';
import { QuizClient } from '@/components/quiz-client';

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const quiz = quizzes.find((q) => q.id === params.quizId);

  if (!quiz) {
    notFound();
  }

  return <QuizClient quiz={quiz} />;
}
