
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
import type { Subject } from '@/lib/dummy-data';

interface SubjectEditorDialogProps {
  children: ReactNode;
  subject?: Subject | null;
  onSubjectSaved: (subject: Subject) => void;
}

export function SubjectEditorDialog({ children, subject = null, onSubjectSaved }: SubjectEditorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(subject?.name || '');
  const [description, setDescription] = useState(subject?.description || '');

  const handleSave = () => {
    const newSubject: Subject = {
      id: subject?.id || name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      image: subject?.image || 'https://placehold.co/600x400',
      noteCount: subject?.noteCount || 0,
      quizCount: subject?.quizCount || 0,
    };
    onSubjectSaved(newSubject);
    setIsOpen(false);
    // Reset form if we're creating a new subject
    if (!subject) {
        setName('');
        setDescription('');
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
          <Button onClick={handleSave}>Save Subject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
