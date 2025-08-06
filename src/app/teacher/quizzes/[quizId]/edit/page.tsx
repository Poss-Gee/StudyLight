
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getQuiz, getSubjects, saveQuiz } from '@/lib/firestore';
import type { Subject, Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';

const questionSchema = z.object({
    id: z.string().optional(),
    text: z.string().min(1, "Question text cannot be empty."),
    options: z.array(z.string().min(1, "Option text cannot be empty.")).min(2, "Must have at least two options."),
    correctAnswer: z.coerce.number().min(0, "Please select a correct answer."),
});

export const quizFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    subject: z.string().min(1, "Please select a subject."),
    questions: z.array(questionSchema).min(1, "A quiz must have at least one question."),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export default function QuizEditorPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const quizId = params.quizId as string;
    const isNewQuiz = quizId === 'new';
    
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(!isNewQuiz);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiTopic, setAiTopic] = useState('');

    const form = useForm<QuizFormValues>({
        resolver: zodResolver(quizFormSchema),
        defaultValues: {
            title: '',
            subject: '',
            questions: [],
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "questions"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectsData = await getSubjects();
                setSubjects(subjectsData);

                if (!isNewQuiz) {
                    const quizData = await getQuiz(quizId);
                    if (!quizData) {
                        notFound();
                        return;
                    }
                    setQuiz(quizData);
                    form.reset({
                        title: quizData.title,
                        subject: quizData.subject,
                        questions: quizData.questions.map(q => ({...q, id: q.id || `q-${Math.random()}`}))
                    });
                } else {
                     form.reset({
                        title: '',
                        subject: '',
                        questions: [{ text: '', options: ['', '', '', ''], correctAnswer: 0 }],
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast({ variant: 'destructive', title: "Error", description: "Failed to load required data." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [quizId, isNewQuiz, form, toast]);

    const handleAiGenerate = async () => {
        const subjectId = form.getValues('subject');
        if (!aiTopic || !subjectId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a topic and select a subject to generate a quiz.' });
            return;
        }

        setIsGenerating(true);
        try {
            const subjectName = subjects.find(s => s.id === subjectId)?.name || '';
            const result = await generateQuiz({ topic: aiTopic, subject: subjectName, questionCount: 5 });
            
            form.setValue('title', result.title);
            replace(result.questions.map(q => ({ ...q, id: `q-${Math.random()}` })));

            toast({ title: 'Quiz Generated!', description: 'The generated quiz has been populated in the form.' });
        } catch (error) {
            console.error('AI generation failed', error);
            toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate the quiz with AI.' });
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = async (data: QuizFormValues) => {
        setLoading(true);
        try {
            const finalQuizData = {
                ...data,
                 questions: data.questions.map((q, index) => ({
                    ...q,
                    options: q.options.filter(opt => (opt || '').trim() !== ''), // remove empty options
                    id: q.id?.startsWith('q-') ? `question-${index}-${Date.now()}` : q.id || `question-${index}-${Date.now()}`
                })),
            };
            
            await saveQuiz(finalQuizData, isNewQuiz ? undefined : quizId);
            toast({ title: 'Success!', description: `Quiz has been ${isNewQuiz ? 'created' : 'updated'}.` });
            router.push('/teacher/quizzes');
        } catch (error) {
            console.error("Failed to save quiz:", error);
            toast({ variant: 'destructive', title: "Save Failed", description: "Could not save the quiz." });
        } finally {
            setLoading(false);
        }
    };
    
    const addQuestion = () => {
        append({ text: '', options: ['', '', '', ''], correctAnswer: 0, id: `q-${fields.length}-${Date.now()}` });
    };

    if (loading && !isNewQuiz) {
        return <Skeleton className="w-full h-96" />;
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/teacher/quizzes">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to quizzes</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-2xl">{isNewQuiz ? 'Create Quiz' : 'Edit Quiz'}</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Details</CardTitle>
                            <CardDescription>Set the title, subject and other details for your quiz.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quiz Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Algebra Basics" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a subject" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subjects.map(subject => (
                                                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {isNewQuiz && (
                                <div className="p-4 border rounded-lg space-y-4 bg-card-nested">
                                    <Label>Generate with AI</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Provide a topic and let AI generate the quiz for you.
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g., Photosynthesis"
                                            value={aiTopic}
                                            onChange={(e) => setAiTopic(e.target.value)}
                                            disabled={isGenerating}
                                        />
                                        <Button type="button" onClick={handleAiGenerate} disabled={isGenerating}>
                                            <Wand2 className="mr-2" />
                                            {isGenerating ? 'Generating...' : 'Generate'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                            <CardTitle>Questions</CardTitle>
                            <CardDescription>Add questions and options for your quiz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                    <FormField
                                        control={form.control}
                                        name={`questions.${index}.text`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Question {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="What is 2 + 2?" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <div className="grid gap-4 sm:grid-cols-2">
                                     {[...Array(4)].map((_, optionIndex) => (
                                       <FormField
                                            key={`${field.id}-option-${optionIndex}`}
                                            control={form.control}
                                            name={`questions.${index}.options.${optionIndex}`}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Option {optionIndex + 1}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={`Option ${optionIndex + 1}`} {...field} value={field.value || ''} />
                                                    </FormControl>
                                                     <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                     ))}
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`questions.${index}.correctAnswer`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Correct Answer</FormLabel>
                                                 <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select the correct answer" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {form.watch(`questions.${index}.options`).map((opt, i) => (
                                                            (opt || '').trim() && 
                                                            <SelectItem key={i} value={i.toString()}>
                                                                {opt || `Option ${i+1}`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => remove(index)}
                                        disabled={fields.length <= 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-4">
                             <Button type="button" variant="outline" onClick={addQuestion}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                            </Button>
                        </CardFooter>
                    </Card>
                    
                    <div className="flex justify-end gap-2">
                         <Button type="button" variant="outline" onClick={() => router.push('/teacher/quizzes')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || isGenerating || !form.formState.isValid}>
                            {loading || isGenerating ? 'Saving...' : 'Save Quiz'}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
