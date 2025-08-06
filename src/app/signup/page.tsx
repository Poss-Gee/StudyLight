import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
             <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>Enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="student@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full !mt-6" asChild>
                <Link href="/dashboard">Create Account</Link>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/" className="underline text-accent">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
