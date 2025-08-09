
'use server';
/**
 * @fileOverview A quiz-generation AI agent.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateQuizInputSchema = z.object({
    subject: z.string().describe('The subject of the quiz.'),
    title: z.string().describe('The title of the quiz.'),
    numQuestions: z.coerce.number().min(1).max(10).default(5),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;


const questionSchema = z.object({
    text: z.string().describe("The question text."),
    options: z.array(z.string()).describe("An array of 4 possible answers."),
    correctAnswer: z.coerce.number().describe("The index (0-3) of the correct answer in the options array."),
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(questionSchema).describe('The array of generated questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
    return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateQuizPrompt',
    input: { schema: GenerateQuizInputSchema },
    output: { schema: GenerateQuizOutputSchema },
    prompt: `You are an expert in creating educational content. Generate a quiz with a specified number of questions on a given topic for a particular subject.

For each question, provide 4 options and indicate the correct answer's index.

Subject: {{{subject}}}
Quiz Title: {{{title}}}
Number of Questions: {{{numQuestions}}}
`,
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
