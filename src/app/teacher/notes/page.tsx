
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PlusCircle, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subjects as initialSubjects, type Subject } from '@/lib/dummy-data';
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

export default function TeacherNotesPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const handleSubjectSaved = (subject: Subject) => {
    setSubjects(prevSubjects => {
      const existingSubjectIndex = prevSubjects.findIndex(s => s.id === subject.id);
      if (existingSubjectIndex > -1) {
        const newSubjects = [...prevSubjects];
        newSubjects[existingSubjectIndex] = subject;
        return newSubjects;
      } else {
        return [...prevSubjects, subject];
      }
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prevSubjects => prevSubjects.filter(s => s.id !== subjectId));
    // In a real app, you would also delete related notes and quizzes
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{subject.name}</CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <Badge variant="secondary">{subject.noteCount} Notes</Badge>
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
    </>
  );
}
