'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a rich, interactive set of content
 * for the AstroBio Explorer, tailored for professional/research audiences.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {ProOutputSchema} from "@/lib/types";

const ProInputSchema = z.object({
  query: z.string().describe('The search query for the NASA space biology experiment.'),
});


export type ProResult = z.infer<typeof ProOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateProContentPrompt',
  input: { schema: ProInputSchema },
  output: { schema: ProOutputSchema },
  prompt: `You are an AI expert in NASA space biology, tasked with creating a comprehensive and technical educational experience for university students and researchers. Based on the user's query, you will generate a structured set of content.

You MUST use real-time, verifiable data from NASA's official sources (like NASA.gov, GeneLab, Task Book) and reputable scientific journals.

User Query: {{{query}}}

**Instructions**:
*   Generate all content to be technical, detailed, and suitable for a professional audience.
*   The 'summary' text MUST include inline citations (e.g., "[1]", "[2]") that correspond to the 'sources' array. The 0-indexed position in the array maps to the citation number (e.g., sources[0] is citation "[1]").
*   The 'sources' array must contain at least 3 real, verifiable source documents with direct quotes as snippets.
*   The chart data (for both 'barChart' and 'areaChart') should be realistic and plausible for the given experiment. Generate distinct data and labels for each chart.

Please generate the full output object according to the specified schema.`,
});

const generateProContentFlow = ai.defineFlow(
  {
    name: 'generateProContentFlow',
    inputSchema: ProInputSchema,
    outputSchema: ProOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate Pro content from AI.');
    }
    return output;
  }
);

export async function generateProContent(input: z.infer<typeof ProInputSchema>): Promise<ProResult> {
    return generateProContentFlow(input);
}
