
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSubjects } from '@/lib/firestore';
import { type Subject } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await getSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Subjects</h1>
      </div>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Card key={i} className="overflow-hidden h-full flex flex-col">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-6 flex-grow">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-6 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link href={`/notes/${subject.id}`} key={subject.id}>
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint={`${subject.name} textbook`}
                  />
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="text-xl text-primary">{subject.name}</CardTitle>
                  <CardDescription className="mt-2">{subject.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Badge variant="secondary">{subject.noteCount} Notes</Badge>
                  <Badge variant="secondary">{subject.quizCount} Quizzes</Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
