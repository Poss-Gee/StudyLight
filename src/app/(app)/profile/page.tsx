import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { userProfile, subjects } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { name, email, role, quizHistory } = userProfile;
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">My Profile</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="https://placehold.co/100x100" alt={name} data-ai-hint="student portrait" />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{name}</CardTitle>
              <CardDescription>{email}</CardDescription>
              <Badge variant="outline" className="mt-2">{role}</Badge>
            </CardHeader>
            <CardContent>
               <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>A record of all your quiz attempts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizHistory.map((history) => {
                    const subject = subjects.find(s => s.id === history.subject);
                    return (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.quizTitle}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{subject?.name || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-bold ${history.score >= 80 ? 'text-green-400' : history.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{history.score}%</TableCell>
                      <TableCell>{history.date}</TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
