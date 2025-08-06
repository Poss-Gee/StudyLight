import { notes, subjects } from '@/lib/dummy-data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default function NoteDetailPage({ params }: { params: { subject: string, noteId: string } }) {
  const note = notes.find((n) => n.id === params.noteId && n.subject === params.subject);
  const subject = subjects.find((s) => s.id === params.subject);

  if (!note || !subject) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="space-y-2 mb-8">
        <Badge variant="secondary">{subject.name}</Badge>
        <h1 className="text-3xl font-bold md:text-4xl text-primary">{note.title}</h1>
      </div>
      <div
        className="prose prose-invert prose-lg max-w-none prose-headings:text-accent prose-a:text-primary prose-strong:text-white prose-blockquote:border-primary"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </article>
  );
}
