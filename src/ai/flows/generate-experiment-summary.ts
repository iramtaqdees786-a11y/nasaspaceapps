'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating summaries of NASA space biology experiments,
 * tailored to either K-12 or Pro mode.
 *
 * - generateExperimentSummary - A function that takes a search query and mode (K-12 or Pro) and returns a summary.
 * - GenerateExperimentSummaryInput - The input type for the generateExperimentSummary function.
 * - GenerateExperimentSummaryOutput - The return type for the generateExperimentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExperimentSummaryInputSchema = z.object({
  query: z.string().describe('The search query for the NASA space biology experiment.'),
  mode: z.enum(['K-12', 'Pro']).describe('The user mode: K-12 for simplified summaries, Pro for technical summaries.'),
});
export type GenerateExperimentSummaryInput = z.infer<typeof GenerateExperimentSummaryInputSchema>;

const GenerateExperimentSummaryOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the experiment, tailored to the specified mode.'),
});
export type GenerateExperimentSummaryOutput = z.infer<typeof GenerateExperimentSummaryOutputSchema>;

export async function generateExperimentSummary(input: GenerateExperimentSummaryInput): Promise<GenerateExperimentSummaryOutput> {
  return generateExperimentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExperimentSummaryPrompt',
  input: {schema: GenerateExperimentSummaryInputSchema},
  output: {schema: GenerateExperimentSummaryOutputSchema},
  prompt: `You are an AI expert in NASA space biology experiments. Your task is to generate a summary of an experiment based on the user's query. The summary should be tailored to the user's selected mode.
You must use the most current, real-time data available from NASA. Always cite your sources and provide direct links to the NASA publications or data repositories used.

If the mode is K-12, provide a simplified and engaging summary suitable for students in grades K-12. Use analogies, fun facts, and simple language to explain the experiment's purpose, methodology, and key findings. Include links to kid-friendly NASA resources.

If the mode is Pro, provide a technical and detailed summary suitable for college students and professionals. Include references to original NASA publications, key metrics, and relevant data. Include direct links to the papers and datasets.

User Query: {{{query}}}
Mode: {{{mode}}}

Summary:`,
});

const generateExperimentSummaryFlow = ai.defineFlow(
  {
    name: 'generateExperimentSummaryFlow',
    inputSchema: GenerateExperimentSummaryInputSchema,
    outputSchema: GenerateExperimentSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
