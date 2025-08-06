
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getStudents } from '@/lib/firestore';
import { type UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface StudentData extends UserProfile {
    quizzesTaken: number;
    avgScore: number;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentProfiles = await getStudents();
                const studentData = studentProfiles.map(profile => {
                    const quizzesTaken = profile.quizHistory?.length || 0;
                    const totalScore = profile.quizHistory?.reduce((acc, h) => acc + h.score, 0) || 0;
                    const avgScore = quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0;
                    return { ...profile, quizzesTaken, avgScore };
                });
                setStudents(studentData);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Student Overview</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>
            A list of all students enrolled in your subjects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Quizzes Taken</TableHead>
                <TableHead className="text-right">Average Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                    </TableRow>
                ))
              ) : students.length > 0 ? (
                students.map((student) => (
                    <TableRow key={student.uid}>
                    <TableCell>
                        <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://placehold.co/100x100.png?text=${student.name?.charAt(0)}`} alt={student.name || ''} data-ai-hint="student portrait" />
                            <AvatarFallback>{student.name?.charAt(0) || 'S'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">{student.quizzesTaken}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold ${student.avgScore >= 80 ? 'text-green-400' : student.avgScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {student.quizzesTaken > 0 ? `${student.avgScore}%` : 'N/A'}
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center">No students have signed up yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
