
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PlusCircle, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSubjects, deleteSubject as deleteSubjectFromDB } from '@/lib/firestore';
import { type Subject } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { SubjectEditorDialog } from '@/components/subject-editor-dialog';
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

export default function TeacherNotesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const fetchedSubjects = await getSubjects();
      setSubjects(fetchedSubjects);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch subjects.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSaved = () => {
    fetchSubjects(); // Refetch all subjects after one is saved
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await deleteSubjectFromDB(subjectId);
      toast({ title: 'Success', description: 'Subject deleted successfully.' });
      fetchSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete subject.' });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Subjects & Notes</h1>
        <SubjectEditorDialog onSubjectSaved={handleSubjectSaved}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
            </Button>
        </SubjectEditorDialog>
      </div>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{subject.name}</CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex gap-2">
                 <Badge variant="secondary">{subject.noteCount} Notes</Badge>
                 <Badge variant="secondary">{subject.quizCount} Quizzes</Badge>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="sm">
                          <Trash2 />
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the subject and all its associated notes and quizzes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSubject(subject.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                 <SubjectEditorDialog subject={subject} onSubjectSaved={handleSubjectSaved}>
                   <Button variant="outline" size="sm">
                     <Edit className="mr-2" /> Edit Subject
                   </Button>
                 </SubjectEditorDialog>
                 <Button size="sm" asChild>
                  <Link href={`/teacher/notes/${subject.id}`}>
                      Manage Notes <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {subjects.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
               <CardHeader className="text-center">
                 <CardTitle>No Subjects Yet</CardTitle>
                 <CardDescription>Get started by creating a new subject.</CardDescription>
                  <CardContent className="mt-4">
                      <SubjectEditorDialog onSubjectSaved={handleSubjectSaved}>
                          <Button>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Subject
                          </Button>
                      </SubjectEditorDialog>
                  </CardContent>
               </CardHeader>
             </Card>
          )}
        </div>
      )}
    </>
  );
}
