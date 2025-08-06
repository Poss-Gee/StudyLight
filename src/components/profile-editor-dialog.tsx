
'use client';

import { useState, type ReactNode, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface ProfileEditorDialogProps {
  children: ReactNode;
  onProfileUpdated: (updatedProfile: any) => void;
}

export function ProfileEditorDialog({ children, onProfileUpdated }: ProfileEditorDialogProps) {
  const { userProfile, updateUserProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!name) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name cannot be empty.' });
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(name);
      onProfileUpdated({ ...userProfile, name });
      toast({ title: 'Success', description: 'Your profile has been updated.' });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not update your profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Your full name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={userProfile?.email || ''}
              className="col-span-3"
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
