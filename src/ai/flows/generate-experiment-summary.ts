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

const GlossaryTermSchema = z.object({
  term: z.string().describe("The scientific term."),
  definition: z.string().describe("A simple, K-12 friendly definition of the term."),
});

const SourceDocumentSchema = z.object({
    title: z.string().describe("The title of the source document."),
    url: z.string().describe("The direct URL to the source document."),
    snippet: z.string().describe("A relevant snippet from the document that supports the summary."),
});

const GenerateExperimentSummaryOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the experiment, tailored to the specified mode.'),
  methodology: z.string().optional().describe("A summary of the experiment's methodology (Pro mode only)."),
  futureResearch: z.string().optional().describe("Potential future research directions based on the experiment's findings (Pro mode only)."),
  sources: z.array(SourceDocumentSchema).optional().describe("A list of source documents used to generate the summary (Pro mode only)."),
  glossary: z.array(GlossaryTermSchema).optional().describe("A list of key terms and their simple definitions (K-12 mode only)."),
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

If the mode is K-12, provide a simplified and engaging summary suitable for students in grades K-12. Use analogies, fun facts, and simple language to explain the experiment's purpose, methodology, and key findings. Also, identify 3-5 key scientific terms from the summary and provide simple, one-sentence definitions for them in the 'glossary' field.

If the mode is Pro, provide a technical and detailed summary suitable for college students and professionals. Include references to original NASA publications, key metrics, and relevant data. You must populate the 'methodology', 'futureResearch', and 'sources' fields. For the 'sources' field, provide at least two relevant documents with a title, URL, and a supporting snippet.

User Query: {{{query}}}
Mode: {{{mode}}}
`,
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
