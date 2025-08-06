
'use client';
import { useAuth } from '@/hooks/use-auth';
import StudentLayout from '../(student)/layout';
import TeacherLayout from '../teacher/layout';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { userProfile } = useAuth();
    
    if (userProfile?.role === 'teacher') {
        return <TeacherLayout>{children}</TeacherLayout>
    }
    
    // Default to student layout
    return <StudentLayout>{children}</StudentLayout>
}
