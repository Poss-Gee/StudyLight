
import Link from 'next/link';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subjects } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';

export default function TeacherNotesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Subjects & Notes</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="flex flex-col h-full hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{subject.name}</CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <Badge variant="secondary">{subject.noteCount} Notes</Badge>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
               <Button variant="outline" size="sm">Edit Subject</Button>
               <Button size="sm" asChild>
                <Link href={`/teacher/notes/${subject.id}`}>
                    Manage Notes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
