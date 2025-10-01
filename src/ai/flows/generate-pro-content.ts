'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a rich, interactive set of content
 * for the AstroBio Explorer, tailored for professional/research audiences.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SourceDocumentSchema = z.object({
  title: z.string().describe('The title of the source document.'),
  url: z.string().describe('The direct URL to the source document (must be a real, accessible NASA link or a link to a scientific paper).'),
  snippet: z.string().describe('A relevant snippet from the document that supports the summary. This snippet should be a direct quote.'),
});

const KeyMetricSchema = z.object({
  name: z.string().describe('The name of the key metric (e.g., "Mission Duration").'),
  value: z.string().describe('The value of the metric (e.g., "42").'),
  unit: z.string().describe('The unit for the metric (e.g., "days").'),
});

const ChartDataPointSchema = z.object({
  name: z.string().describe('The label for the data point on the x-axis (e.g., "Day 1").'),
  value1: z.number().describe('The first numerical value for the data point.'),
  value2: z.number().describe('The second numerical value for the data point.'),
});

const PublicationSchema = z.object({
  title: z.string().describe('The full title of the publication.'),
  url: z.string().describe('A valid, real URL to the publication on a site like NASA PubSpace or PubMed.'),
  authors: z.array(z.string()).describe('A list of the primary authors.'),
});

const DataSetSchema = z.object({
    name: z.string().describe('The name of the data repository or dataset (e.g., "GeneLab GLDS-123").'),
    url: z.string().describe('A valid, real URL to the dataset.'),
    description: z.string().describe('A brief description of the dataset.'),
});

const ProInputSchema = z.object({
  query: z.string().describe('The search query for the NASA space biology experiment.'),
});

const ProOutputSchema = z.object({
  introduction: z.string().describe('A concise, technical introduction to the experiment or topic.'),
  summary: z.string().describe('The main technical summary. This text may contain bracketed, numbered citations like "[1]", "[2]", etc. These citations must correspond to the `sources` array.'),
  methodology: z.string().describe("A detailed summary of the experiment's methodology."),
  futureResearch: z.string().describe("Potential future research directions based on the experiment's findings."),
  conclusion: z.string().describe('A technical conclusion summarizing the key takeaways.'),
  sources: z.array(SourceDocumentSchema).min(3).describe('A list of at least 3 real source documents used to generate the summary. The snippets should be directly quoted from the source.'),
  keyMetrics: z.array(KeyMetricSchema).length(3).describe('An array of exactly 3 key metrics relevant to the experiment.'),
  chart: z.object({
      data: z.array(ChartDataPointSchema).min(5).describe('An array of at least 5 data points for the chart.'),
      description: z.string().describe('A brief, insightful description of what the chart visualizes.'),
      xAxisLabel: z.string().describe("The label for the chart's X-axis."),
      yAxisLabel1: z.string().describe("The label for the primary Y-axis (for value1)."),
      yAxisLabel2: z.string().describe("The label for the secondary Y-axis (for value2)."),
  }),
  researchNavigator: z.object({
    relatedStudies: z.array(PublicationSchema).length(3).describe("A list of exactly 3 related studies from the NASA Task Book or similar sources."),
    dataRepositories: z.array(DataSetSchema).length(2).describe("A list of exactly 2 relevant data repositories."),
    keyPublications: z.array(PublicationSchema).length(2).describe("A list of exactly 2 key, seminal publications in this research area."),
  }),
});

export type ProResult = z.infer<typeof ProOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateProContentPrompt',
  input: { schema: ProInputSchema },
  output: { schema: ProOutputSchema },
  prompt: `You are an AI expert in NASA space biology, tasked with creating a comprehensive and technical educational experience for university students and researchers. Based on the user's query, you will generate a structured set of content.

You MUST use real-time, verifiable data from NASA's official sources (like NASA.gov, GeneLab, Task Book) and reputable scientific journals. All URLs must be real and lead to the correct documents.

User Query: {{{query}}}

**Instructions**:
*   Generate all content to be technical, detailed, and suitable for a professional audience.
*   The 'summary' text MUST include inline citations (e.g., "[1]", "[2]") that correspond to the 'sources' array. The 0-indexed position in the array maps to the citation number (e.g., sources[0] is citation "[1]").
*   The 'sources' array must contain at least 3 real, verifiable source documents with direct quotes as snippets.
*   The 'chart' data should be realistic and plausible for the given experiment.
*   The 'researchNavigator' content must be populated with real, relevant studies and datasets from official sources.

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
