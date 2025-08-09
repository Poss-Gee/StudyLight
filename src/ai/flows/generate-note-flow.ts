
'use server';
/**
 * @fileOverview A note-generation AI agent.
 *
 * - generateNote - A function that handles the note generation process.
 * - GenerateNoteInput - The input type for the generateNote function.
 * - GenerateNoteOutput - The return type for the generateNote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateNoteInputSchema = z.object({
  subject: z.string().describe('The subject of the note.'),
  topic: z.string().describe('The specific topic for the note.'),
});
export type GenerateNoteInput = z.infer<typeof GenerateNoteInputSchema>;

const GenerateNoteOutputSchema = z.object({
  title: z.string().describe('The generated title for the note.'),
  content: z.string().describe('The generated content for the note in HTML format.'),
});
export type GenerateNoteOutput = z.infer<typeof GenerateNoteOutputSchema>;


export async function generateNote(input: GenerateNoteInput): Promise<GenerateNoteOutput> {
    return generateNoteFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateNotePrompt',
  input: { schema: GenerateNoteInputSchema },
  output: { schema: GenerateNoteOutputSchema },
  prompt: `You are an expert educator. Generate a concise, well-structured study note for the given subject and topic.

The output should be in HTML format, using tags like <h2> for headings, <p> for paragraphs, <ul> and <li> for lists, and <strong> for important terms.

Do not include <html>, <head>>, or <body> tags.

Subject: {{{subject}}}
Topic: {{{topic}}}`,
});

const generateNoteFlow = ai.defineFlow(
  {
    name: 'generateNoteFlow',
    inputSchema: GenerateNoteInputSchema,
    outputSchema: GenerateNoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
