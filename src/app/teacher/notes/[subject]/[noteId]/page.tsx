
'use client';

import { getNote, getSubject } from '@/lib/firestore';
import { type Note, type Subject } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function TeacherNoteDetailPage() {
  const params = useParams();
  const { subject: subjectId, noteId } = params;

  const [note, setNote] = useState<Note | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!noteId || !subjectId) return;

    const fetchData = async () => {
      try {
        const [noteData, subjectData] = await Promise.all([
          getNote(noteId as string),
          getSubject(subjectId as string),
        ]);

        if (!noteData || !subjectData || noteData.subject !== subjectData.id) {
          notFound();
          return;
        }

        setNote(noteData);
        setSubject(subjectData);
      } catch (error) {
        console.error("Failed to fetch note details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [noteId, subjectId]);
  

  if (loading) {
     return (
        <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-8">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-3/4" />
                 <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    );
  }

  if (!note || !subject) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-lg font-semibold md:text-2xl">
          <Link href="/teacher/notes" className="text-muted-foreground hover:text-primary">
            Subjects
          </Link>
          <span className="text-muted-foreground mx-2">/</span>
           <Link href={`/teacher/notes/${subject.id}`} className="text-muted-foreground hover:text-primary">
            {subject.name}
          </Link>
           <span className="text-muted-foreground mx-2">/</span>
          {note.title}
        </h1>
        <Badge variant="secondary">{subject.name}</Badge>
        <h2 className="text-3xl font-bold md:text-4xl text-primary">{note.title}</h2>
      </div>
      <div
        className="prose prose-invert prose-lg max-w-none prose-headings:text-accent prose-a:text-primary prose-strong:text-white prose-blockquote:border-primary"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </article>
  );
}
