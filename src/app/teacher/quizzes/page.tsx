
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PlusCircle, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuizzes, getSubjects, deleteQuiz as deleteQuizFromDB } from '@/lib/firestore';
import { type Quiz, type Subject } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuizzesAndSubjects = async () => {
    setLoading(true);
    try {
      const [quizzesData, subjectsData] = await Promise.all([
        getQuizzes(),
        getSubjects(),
      ]);
      setQuizzes(quizzesData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch quizzes or subjects.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzesAndSubjects();
  }, []);

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteQuizFromDB(quizId);
      toast({ title: 'Success', description: 'Quiz deleted successfully.' });
      fetchQuizzesAndSubjects(); // Refresh list
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the quiz.' });
    }
  };

  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A';

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Quizzes</h1>
        <Button asChild>
          <Link href="/teacher/quizzes/new/edit">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Quiz
          </Link>
        </Button>
      </div>
       {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
       ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
                <Card key={quiz.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.questions.length} questions.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <Badge variant="secondary">{getSubjectName(quiz.subject)}</Badge>
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-end gap-2">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="sm" className="flex-grow sm:flex-grow-0">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the quiz titled &quot;{quiz.title}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                     <Button variant="outline" size="sm" asChild className="flex-grow sm:flex-grow-0">
                        <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Quiz
                        </Link>
                     </Button>
                     <Button asChild size="sm" className="flex-grow sm:flex-grow-0">
                       {/* This link can later go to a results page */}
                      <Link href="#">
                        View Results <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
             {quizzes.length === 0 && (
                <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader className="text-center">
                        <CardTitle>No Quizzes Available</CardTitle>
                        <CardDescription>Get started by creating a new quiz.</CardDescription>
                         <CardContent className="mt-4">
                            <Button asChild>
                                <Link href="/teacher/quizzes/new/edit">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Create First Quiz
                                </Link>
                            </Button>
                         </CardContent>
                    </CardHeader>
                </Card>
             )}
          </div>
       )}
    </>
  );
}
