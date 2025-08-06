
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuizzes, getSubjects } from '@/lib/firestore';
import { type Quiz, type Subject } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, subjectsData] = await Promise.all([
          getQuizzes(),
          getSubjects(),
        ]);
        setQuizzes(quizzesData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to fetch quizzes and subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'General';
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Quizzes</h1>
      </div>
       {loading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(2)].map((_, i) => (
             <Card key={i} className="flex flex-col h-full">
               <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
               </CardHeader>
               <CardContent className="flex-grow">
                 <Skeleton className="h-6 w-1/4" />
               </CardContent>
               <CardFooter>
                 <Skeleton className="h-10 w-full" />
               </CardFooter>
             </Card>
           ))}
         </div>
       ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
              <Card key={quiz.id} className="flex flex-col h-full hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.questions.length} questions to test your knowledge.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Badge variant="secondary">{getSubjectName(quiz.subject)}</Badge>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/quizzes/${quiz.id}`}>
                      Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
          ))}
          {quizzes.length === 0 && (
              <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                      <CardTitle>No Quizzes Available</CardTitle>
                      <CardDescription>More quizzes are coming soon. Check back later!</CardDescription>
                  </CardHeader>
              </Card>
          )}
        </div>
       )}
    </>
  );
}
