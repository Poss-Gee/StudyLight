
import Link from 'next/link';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quizzes, subjects } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';

export default function TeacherQuizzesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Quizzes</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Quiz
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const subject = subjects.find((s) => s.id === quiz.subject);
          return (
            <Card key={quiz.id} className="flex flex-col h-full hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{quiz.title}</CardTitle>
                <CardDescription>{quiz.questions.length} questions.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {subject && <Badge variant="secondary">{subject.name}</Badge>}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm">Edit Quiz</Button>
                 <Button asChild size="sm">
                  <Link href={`/teacher/quizzes/${quiz.id}`}>
                    View Results <ArrowRight className="ml-2 h-4 w-4" />
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
                    <CardDescription>Get started by creating a new quiz.</CardDescription>
                </CardHeader>
            </Card>
         )}
      </div>
    </>
  );
}
