import Link from 'next/link';
import {
  BookCopy,
  GraduationCap,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/notes', icon: BookCopy, label: 'Notes' },
    { href: '/quizzes', icon: HelpCircle, label: 'Quizzes' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b border-border/50 px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-border/50 bg-card md:block">
        {sidebarContent}
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border/50 bg-card px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-[280px] bg-card">
              {sidebarContent}
            </SheetContent>
          </Sheet>
           <div className="flex-1">
             <Logo />
           </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background animate-in fade-in">
            {children}
        </main>
      </div>
    </div>
  );
}
