'use server';
/**
 * @fileOverview A quiz generation AI agent.
 *
 * - generateQuizFlow - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuizFlow function.
 * - GenerateQuizOutput - The return type for the generateQuizFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  subject: z.string().describe('The subject of the quiz.'),
  questionCount: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('The title of the quiz.'),
  questions: z.array(z.object({
    text: z.string().describe('The text of the question.'),
    options: z.array(z.string()).describe('An array of 4 multiple-choice options.'),
    correctAnswer: z.number().describe('The index of the correct answer in the options array (0-3).'),
  })).describe('An array of questions for the quiz.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
    return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert quiz creator for students. Generate a multiple-choice quiz based on the provided topic and subject.

The quiz must have a clear title and exactly {{{questionCount}}} questions. Each question must have exactly 4 options and a correct answer index. Ensure the questions are relevant to the topic and the distractors are plausible.

Subject: {{{subject}}}
Topic: {{{topic}}}
Number of Questions: {{{questionCount}}}`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
