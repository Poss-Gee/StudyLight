
'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { PlusCircle, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSubject, getNotesForSubject, deleteNote as deleteNoteFromDB } from '@/lib/firestore';
import { type Note, type Subject } from '@/lib/types';
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
import { NoteEditorDialog } from '@/components/note-editor-dialog';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherSubjectNotesPage() {
  const params = useParams();
  const subjectId = params.subject as string;
  const { toast } = useToast();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotesAndSubject = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const [subjectData, notesData] = await Promise.all([
        getSubject(subjectId),
        getNotesForSubject(subjectId)
      ]);

      if (!subjectData) {
        notFound();
        return;
      }

      setSubject(subjectData);
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch data for this subject.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesAndSubject();
  }, [subjectId]);

  
  const handleNoteSaved = () => {
     fetchNotesAndSubject(); // Refetch everything
  }

  const handleDeleteNote = async (noteId: string) => {
     try {
       await deleteNoteFromDB(noteId);
       toast({ title: 'Success', description: 'Note deleted successfully.' });
       fetchNotesAndSubject();
     } catch (error) {
       console.error("Failed to delete note:", error);
       toast({ variant: 'destructive', title: 'Error', description: 'Could not delete note.' });
     }
  }

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!subject) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          <Link href="/teacher/notes" className="text-muted-foreground hover:text-primary">
            Subjects
          </Link>
          <span className="text-muted-foreground mx-2">/</span>
          {subject.name} Notes
        </h1>
        <NoteEditorDialog subject={subject} onNoteSaved={handleNoteSaved}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Note
          </Button>
        </NoteEditorDialog>
      </div>
      <div className="flex flex-col gap-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>Click to view note details.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                   <NoteEditorDialog subject={subject} note={note} onNoteSaved={handleNoteSaved}>
                     <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Note</span>
                     </Button>
                   </NoteEditorDialog>

                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Note</span>
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the note titled &quot;{note.title}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/student/notes/${subject.id}/${note.id}`} target="_blank">
                      <ArrowRight className="h-5 w-5 text-primary" />
                      <span className="sr-only">View Note</span>
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card>
             <CardHeader className="text-center">
              <CardTitle>No Notes Yet</CardTitle>
              <CardDescription>Get started by creating a new note for this subject.</CardDescription>
              <CardContent className="mt-4">
                <NoteEditorDialog subject={subject} onNoteSaved={handleNoteSaved}>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add First Note
                  </Button>
                </NoteEditorDialog>
              </CardContent>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  );
}
