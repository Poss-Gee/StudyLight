
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Subject, type QuizHistory } from '@/lib/types';
import { getSubjects, getUserQuizHistory } from '@/lib/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ProfileEditorDialog } from '@/components/profile-editor-dialog';

export default function ProfilePage() {
  const { user, userProfile, logout, setUserProfile } = useAuth();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        const [history, subjectsData] = await Promise.all([
          getUserQuizHistory(user.uid),
          getSubjects(),
        ]);
        setQuizHistory(history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  if (loading || !userProfile) {
    return <div>Loading profile...</div>;
  }
  
  const { name, email, role } = userProfile;

  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A';

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
                <AvatarImage src={`https://placehold.co/100x100.png?text=${name?.charAt(0)}`} alt={name || 'User'} data-ai-hint="student portrait" />
                <AvatarFallback>{name ? name.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{name}</CardTitle>
              <CardDescription>{email}</CardDescription>
              <Badge variant="outline" className="mt-2 capitalize">{role}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
               <ProfileEditorDialog onProfileUpdated={handleProfileUpdate}>
                 <Button variant="outline" className="w-full">Edit Profile</Button>
               </ProfileEditorDialog>
               <Button variant="outline" className="w-full" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
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
                  {quizHistory.length > 0 ? quizHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.quizTitle}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getSubjectName(history.subject)}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-bold ${history.score >= 80 ? 'text-green-400' : history.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{history.score}%</TableCell>
                      <TableCell>{format(new Date(history.date), 'PP')}</TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center">No quiz history yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
