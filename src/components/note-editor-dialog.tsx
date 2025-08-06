
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2 } from 'lucide-react';
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
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const isEditing = note !== null;

  useEffect(() => {
    if (isOpen) {
        // Reset form when dialog opens for a new note
        if (!isEditing) {
            setTitle('');
            setContent('');
            setAiTopic('');
        } else {
            setTitle(note.title);
            setContent(note.content);
        }
    }
  }, [isOpen, isEditing, note]);

  const handleAiGenerate = async () => {
    if (!aiTopic) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please provide a topic to generate a note.' });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateNote({ topic: aiTopic, subject: subject.name });
        setTitle(result.title);
        setContent(result.content);
        toast({ title: 'Note Generated!', description: 'The generated note has been populated in the form.'});
    } catch (error) {
        console.error('AI generation failed', error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate the note with AI.'});
    } finally {
        setIsGenerating(false);
    }
  };

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
        
        <Tabs defaultValue="manual" className="w-full">
            <TabsList className={`grid w-full grid-cols-2 ${isEditing ? 'hidden' : ''}`}>
                <TabsTrigger value="manual">Create Manually</TabsTrigger>
                <TabsTrigger value="ai">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate with AI
                </TabsTrigger>
            </TabsList>
            <TabsContent value="ai">
                 <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Provide a topic and let AI generate the note content for you. You can review and edit it before saving.
                    </p>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="topic" className="text-right">Topic</Label>
                         <Input
                            id="topic"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., The American Revolution"
                            disabled={isGenerating}
                        />
                    </div>
                     <div className="flex justify-end">
                        <Button onClick={handleAiGenerate} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Note'}
                        </Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="manual">
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
            </TabsContent>
        </Tabs>

        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={loading || isGenerating}>
                {loading ? 'Saving...' : 'Save Note'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
