import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quizzes, subjects } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function QuizzesPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Quizzes</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const subject = subjects.find((s) => s.id === quiz.subject);
          return (
            <Card key={quiz.id} className="flex flex-col h-full hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{quiz.title}</CardTitle>
                <CardDescription>{quiz.questions.length} questions to test your knowledge.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {subject && <Badge variant="secondary">{subject.name}</Badge>}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/quizzes/${quiz.id}`}>
                    Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
         {quizzes.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle>No Quizzes Available</CardTitle>
                    <CardDescription>More quizzes are coming soon. Check back later!</CardDescription>
                </CardHeader>
            </Card>
         )}
      </div>
    </>
  );
}
