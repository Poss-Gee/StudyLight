
'use client';

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSubject, getNotesForSubject } from '@/lib/firestore';
import { type Subject, type Note } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubjectNotesPage() {
  const params = useParams();
  const subjectId = params.subject as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;

    const fetchData = async () => {
      try {
        const [subjectData, notesData] = await Promise.all([
          getSubject(subjectId),
          getNotesForSubject(subjectId),
        ]);
        
        if (!subjectData) {
          notFound();
          return;
        }

        setSubject(subjectData);
        setNotes(notesData);
      } catch (error) {
        console.error("Failed to fetch subject details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [subjectId]);

  if (loading) {
    return (
        <>
            <Skeleton className="h-8 w-1/2 mb-4" />
            <div className="flex flex-col gap-4">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </>
    );
  }

  if (!subject) {
    return notFound();
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{subject.name} Notes</h1>
      </div>
      <div className="flex flex-col gap-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Link href={`/notes/${subject.id}/${note.id}`} key={note.id}>
              <Card className="hover:border-primary transition-colors">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>Click to read more...</CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary" />
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Notes Yet</CardTitle>
              <CardDescription>Check back later for notes on this subject.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  );
}
