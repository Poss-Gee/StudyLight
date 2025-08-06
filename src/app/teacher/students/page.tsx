
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const students = [
    { id: 's1', name: 'Alex Doe', email: 'alex.doe@example.com', quizzesTaken: 2, avgScore: 83 },
    { id: 's2', name: 'Samantha Blue', email: 'samantha.blue@example.com', quizzesTaken: 1, avgScore: 95 },
    { id: 's3', name: 'John Smith', email: 'john.smith@example.com', quizzesTaken: 5, avgScore: 72 },
    { id: 's4', name: 'Emily White', email: 'emily.white@example.com', quizzesTaken: 3, avgScore: 88 },
];

export default function StudentsPage() {
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
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                         <AvatarImage src={`https://placehold.co/100x100.png?text=${student.name.charAt(0)}`} alt={student.name} data-ai-hint="student portrait" />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
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
                  <TableCell className={`text-right font-bold ${student.avgScore >= 80 ? 'text-green-400' : student.avgScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{student.avgScore}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
