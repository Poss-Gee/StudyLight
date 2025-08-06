
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookPlus, Users, HelpCircle } from 'lucide-react';
import { userProfile, subjects } from '@/lib/dummy-data';

export default function TeacherDashboardPage() {
  const totalStudents = 120; // Dummy data
  const totalSubjects = subjects.length;
  const totalQuizzes = 5; // Dummy data

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Welcome, {userProfile.name}!</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Notes & Subjects</CardTitle>
            <BookPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSubjects} Subjects</div>
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
            <div className="text-2xl font-bold text-primary">{totalQuizzes} Quizzes</div>
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
