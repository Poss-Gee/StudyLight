
'use client';

import { useState, type ReactNode } from 'react';
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
import { Textarea } from './ui/textarea';
import type { Subject } from '@/lib/types';
import { saveSubject } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

interface SubjectEditorDialogProps {
  children: ReactNode;
  subject?: Subject | null;
  onSubjectSaved: () => void;
}

export function SubjectEditorDialog({ children, subject = null, onSubjectSaved }: SubjectEditorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(subject?.name || '');
  const [description, setDescription] = useState(subject?.description || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name || !description) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
        return;
    }
    
    setLoading(true);
    try {
        const newSubjectData = {
          name,
          description,
          image: subject?.image || `https://placehold.co/600x400.png?text=${name.charAt(0)}`,
          noteCount: subject?.noteCount || 0,
          quizCount: subject?.quizCount || 0,
        };
        
        await saveSubject(newSubjectData, subject?.id);

        toast({ title: 'Success', description: `Subject ${subject ? 'updated' : 'created'} successfully.` });
        onSubjectSaved();
        setIsOpen(false);
        if (!subject) {
            setName('');
            setDescription('');
        }
    } catch(error) {
        console.error("Failed to save subject:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save the subject.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subject ? 'Edit Subject' : 'Create New Subject'}</DialogTitle>
          <DialogDescription>
            {subject ? 'Edit the details of your subject.' : 'Add a new subject to manage notes and quizzes.'}
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
              placeholder="e.g. Mathematics"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="A short description of the subject."
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Subject'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
