import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { subjects, notes } from '@/lib/dummy-data';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function SubjectNotesPage({ params }: { params: { subject: string } }) {
  const subject = subjects.find((s) => s.id === params.subject);
  const subjectNotes = notes.filter((note) => note.subject === params.subject);

  if (!subject) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{subject.name} Notes</h1>
      </div>
      <div className="flex flex-col gap-4">
        {subjectNotes.length > 0 ? (
          subjectNotes.map((note) => (
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
