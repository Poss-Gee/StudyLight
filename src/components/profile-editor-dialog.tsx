
'use client';

import { useState, type ReactNode, useEffect, useRef } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Edit } from 'lucide-react';

interface ProfileEditorDialogProps {
  children: ReactNode;
  onProfileUpdated: (updatedProfile: any) => void;
}

export function ProfileEditorDialog({ children, onProfileUpdated }: ProfileEditorDialogProps) {
  const { userProfile, updateUserProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(userProfile?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setPhotoPreview(userProfile.photoURL || null);
    }
  }, [userProfile]);
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name cannot be empty.' });
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(name, photoFile);
      // The auth context will update the userProfile, and the useEffect will catch it.
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
          <div className="flex flex-col items-center gap-4">
             <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || `https://placehold.co/100x100.png?text=${name?.charAt(0)}`} alt={name || 'User'} />
                  <AvatarFallback>{name ? name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => fileInputRef.current?.click()}>
                    <Edit className="h-4 w-4"/>
                    <span className="sr-only">Change picture</span>
                </Button>
                <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoChange}
                />
            </div>
          </div>
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
