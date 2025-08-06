
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
import type { Note, Subject } from '@/lib/dummy-data';

interface NoteEditorDialogProps {
  children: ReactNode;
  subject: Subject;
  note?: Note | null;
  onNoteSaved: (note: Note) => void;
}

export function NoteEditorDialog({ children, subject, note = null, onNoteSaved }: NoteEditorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const handleSave = () => {
    const newNote: Note = {
      id: note?.id || `note-${Date.now()}`,
      subject: subject.id,
      title,
      content,
    };
    onNoteSaved(newNote);
    setIsOpen(false);
    // Reset form if we're creating a new note
    if (!note) {
        setTitle('');
        setContent('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogDescription>
            {note ? 'Edit the details of your note.' : `Create a new note for the subject: ${subject.name}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Introduction to Algebra"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3 min-h-[200px]"
              placeholder="Enter note content. You can use HTML for formatting."
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
