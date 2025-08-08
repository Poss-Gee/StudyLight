
'use server';
/**
 * @fileOverview A note generation AI agent.
 *
 * - generateNoteFlow - A function that handles the note generation process.
 * - GenerateNoteInput - The input type for the generateNoteFlow function.
 * - GenerateNoteOutput - The return type for the generateNoteFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateNoteInputSchema = z.object({
  topic: z.string().describe('The topic for the note.'),
  subject: z.string().describe('The subject of the note.'),
});
export type GenerateNoteInput = z.infer<typeof GenerateNoteInputSchema>;

const GenerateNoteOutputSchema = z.object({
  title: z.string().describe('The title of the note.'),
  content: z.string().describe('The content of the note, formatted in HTML.'),
});
export type GenerateNoteOutput = z.infer<typeof GenerateNoteOutputSchema>;

export async function generateNote(input: GenerateNoteInput): Promise<GenerateNoteOutput> {
  return generateNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNotePrompt',
  input: { schema: GenerateNoteInputSchema },
  output: { schema: GenerateNoteOutputSchema },
  prompt: `You are an expert curriculum developer. Generate a detailed study note based on the provided topic and subject.

The output should be a well-structured note with a clear title and content formatted in HTML. The content should be comprehensive, easy to understand, and suitable for a student. Use appropriate HTML tags like <h1>, <h2>, <h3> for headings, <p> for paragraphs, <ul> and <li> for lists, and <strong> or <em> for emphasis.

Subject: {{{subject}}}
Topic: {{{topic}}}`,
  config: {
    model: 'googleai/gemini-1.5-flash-latest',
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
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
