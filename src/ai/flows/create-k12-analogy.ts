'use server';
/**
 * @fileOverview A K-12 analogy generator for space biology experiments.
 *
 * - createK12Analogy - A function that generates analogies and memory tricks for K-12 users.
 * - CreateK12AnalogyInput - The input type for the createK12Analogy function.
 * - CreateK12AnalogyOutput - The return type for the createK12Analogy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateK12AnalogyInputSchema = z.object({
  experimentDescription: z
    .string()
    .describe('The description of the space biology experiment.'),
});
export type CreateK12AnalogyInput = z.infer<typeof CreateK12AnalogyInputSchema>;

const CreateK12AnalogyOutputSchema = z.object({
  analogy: z
    .string()
    .describe(
      'A fun and memorable analogy to help K-12 students understand the experiment.'
    ),
  memoryTrick: z
    .string()
    .describe(
      'A memory trick or mnemonic device to help K-12 students remember the key concepts.'
    ),
});
export type CreateK12AnalogyOutput = z.infer<typeof CreateK12AnalogyOutputSchema>;

export async function createK12Analogy(
  input: CreateK12AnalogyInput
): Promise<CreateK12AnalogyOutput> {
  return createK12AnalogyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createK12AnalogyPrompt',
  input: {schema: CreateK12AnalogyInputSchema},
  output: {schema: CreateK12AnalogyOutputSchema},
  prompt: `You are an expert in creating analogies and memory tricks for K-12 students to help them understand complex scientific concepts.

  Given the following description of a space biology experiment, generate a fun analogy and a memory trick that would be helpful for K-12 students.

  Experiment Description: {{{experimentDescription}}}

  Analogy:
  Memory Trick: `,
});

const createK12AnalogyFlow = ai.defineFlow(
  {
    name: 'createK12AnalogyFlow',
    inputSchema: CreateK12AnalogyInputSchema,
    outputSchema: CreateK12AnalogyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
