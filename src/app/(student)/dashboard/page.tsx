
'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCopy, HelpCircle, BarChart2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
    const { userProfile } = useAuth();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Welcome, {userProfile?.name}!</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Notes</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Explore Subjects</div>
            <p className="text-xs text-muted-foreground">Dive into detailed notes across various subjects.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/notes">Go to Notes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Test Your Knowledge</div>
            <p className="text-xs text-muted-foreground">Take quizzes to reinforce your learning and track progress.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/quizzes">Take a Quiz</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">View Profile</div>
            <p className="text-xs text-muted-foreground">Check your quiz history and account details.</p>
             <Button asChild size="sm" className="mt-4">
              <Link href="/profile">My Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
