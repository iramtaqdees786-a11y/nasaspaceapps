'use server';

/**
 * @fileOverview Provides daily content for the AstroBio Explorer app.
 *
 * - getDailyFeature - A function that returns a fun fact for K-12 or a complex topic for Pro users.
 * - GetDailyFeatureInput - The input type for the getDailyFeature function.
 * - GetDailyFeatureOutput - The return type for the getDailyFeature function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetDailyFeatureInputSchema = z.object({
  mode: z.enum(['K-12', 'Pro']).describe('The user mode to determine the type of content to generate.'),
});
export type GetDailyFeatureInput = z.infer<typeof GetDailyFeatureInputSchema>;

const GetDailyFeatureOutputSchema = z.object({
  title: z.string().describe('The title for the daily feature section.'),
  content: z.string().describe('The content for the daily feature.'),
});
export type GetDailyFeatureOutput = z.infer<typeof GetDailyFeatureOutputSchema>;

export async function getDailyFeature(input: GetDailyFeatureInput): Promise<GetDailyFeatureOutput> {
  return getDailyFeatureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDailyFeaturePrompt',
  input: { schema: GetDailyFeatureInputSchema },
  output: { schema: GetDailyFeatureOutputSchema },
  prompt: `You are an AI that generates engaging daily content for a space biology app.

  {{#if (eq mode "K-12")}}
  Generate a "Fun Fact of the Day" related to space biology that would be interesting for a K-12 student. Make it short and exciting.
  The title should be "Fun Fact of the Day".
  {{else}}
  Generate a "Complex Topic of the Day" related to an advanced or niche area of space biology suitable for a professional or researcher. Provide a brief, thought-provoking paragraph.
  The title should be "Topic of the Day".
  {{/if}}
  `,
});


const getDailyFeatureFlow = ai.defineFlow(
  {
    name: 'getDailyFeatureFlow',
    inputSchema: GetDailyFeatureInputSchema,
    outputSchema: GetDailyFeatureOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
