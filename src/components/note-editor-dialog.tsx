
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
import { Textarea } from './ui/textarea';
import type { Note, Subject } from '@/lib/types';
import { saveNote } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { generateNote } from '@/ai/flows/generate-note-flow';

interface NoteEditorDialogProps {
  children: ReactNode;
  subject: Subject;
  note?: Note | null;
  onNoteSaved: () => void;
}

export function NoteEditorDialog({ children, subject, note = null, onNoteSaved }: NoteEditorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const isEditing = note !== null;

  useEffect(() => {
    if (isOpen) {
        // Reset form when dialog opens for a new note
        if (!isEditing) {
            setTitle('');
            setContent('');
        } else {
            setTitle(note.title);
            setContent(note.content);
        }
    }
  }, [isOpen, isEditing, note]);

  const handleGenerateNote = async () => {
    if (!title) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a title or topic for the note first.' });
        return;
    }
    setAiLoading(true);
    try {
        const result = await generateNote({ subject: subject.name, topic: title });
        setContent(result.content);
        setTitle(result.title);
    } catch(error) {
        console.error("Failed to generate note:", error);
        toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate the note content.' });
    } finally {
        setAiLoading(false);
    }
  }

  const handleSave = async () => {
    if (!title || !content) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
        return;
    }
    
    setLoading(true);
    try {
        const newNoteData = {
          subject: subject.id,
          title,
          content,
        };
        await saveNote(newNoteData, note?.id);
        
        toast({ title: 'Success', description: `Note ${note ? 'updated' : 'created'} successfully.` });
        onNoteSaved();
        setIsOpen(false);
    } catch(error) {
        console.error("Failed to save note:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save the note.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit the details of your note.' : `Create a new note for the subject: ${subject.name}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                Title/Topic
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
                <div className="col-start-2 col-span-3">
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateNote}
                        disabled={aiLoading}
                        >
                        <Sparkles className={`mr-2 h-4 w-4 ${aiLoading ? 'animate-spin' : ''}`} />
                        {aiLoading ? 'Generating...' : 'Generate Content with AI'}
                    </Button>
                </div>
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
            <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Note'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
