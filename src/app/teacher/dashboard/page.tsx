
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookPlus, Users, HelpCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useCallback } from 'react';
import { getSubjects, getQuizzes } from '@/lib/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherDashboardPage() {
  const { userProfile } = useAuth();
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const totalStudents = 120; // Dummy data for now

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const [subjects, quizzes] = await Promise.all([
            getSubjects(),
            getQuizzes()
        ]);
        setTotalSubjects(subjects.length);
        setTotalQuizzes(quizzes.length);
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Welcome, {userProfile?.name}!</h1>
         <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Notes & Subjects</CardTitle>
            <BookPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold text-primary">{totalSubjects} Subjects</div>}
            <p className="text-xs text-muted-foreground">Create, edit, and assign notes to your subjects.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/teacher/notes">Manage Notes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Quizzes</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold text-primary">{totalQuizzes} Quizzes</div>}
            <p className="text-xs text-muted-foreground">Create new quizzes and view student results.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/teacher/quizzes">Manage Quizzes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Overview</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStudents} Students</div>
            <p className="text-xs text-muted-foreground">View student progress and quiz history.</p>
             <Button asChild size="sm" className="mt-4">
              <Link href="/teacher/students">View Students</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
