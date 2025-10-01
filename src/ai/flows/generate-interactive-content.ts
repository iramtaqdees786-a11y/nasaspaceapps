'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a rich, interactive set of content
 * for the AstroBio Explorer, tailored for either K-12 or Pro modes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Common schemas
const SourceDocumentSchema = z.object({
  title: z.string().describe('The title of the source document.'),
  url: z.string().describe('The direct URL to the source document (must be a real, accessible NASA link or a link to a scientific paper).'),
  snippet: z.string().describe('A relevant snippet from the document that supports the summary. This snippet should be a direct quote.'),
});

// K-12 Schemas
const QuizConceptSchema = z.object({
  id: z.string().describe("A unique identifier for the concept (e.g., 'c1')."),
  text: z.string().describe('The concept term.'),
});

const QuizDefinitionSchema = z.object({
  id: z.string().describe("A unique identifier for the definition (e.g., 'd1')."),
  text: z.string().describe('The definition text.'),
});

const CorrectPairSchema = z.object({
  conceptId: z.string().describe('The ID of the concept.'),
  definitionId: z.string().describe('The ID of the corresponding definition.'),
});

const LearningStyleSchema = z.object({
  style: z.enum(['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic']),
  suggestion: z.string().describe('A tailored learning suggestion for this style.'),
});

const ActivitySchema = z.object({
  title: z.string().describe('A title for the activity (e.g., "Home Experiment").'),
  description: z.string().describe('A description of the activity.'),
});

const ConceptMapNodeSchema = z.object({
    title: z.string().describe("The concept title."),
    details: z.string().describe("A brief, one-sentence detail about the concept."),
    icon: z.enum(['dna', 'thermometer', 'clipboard-check', 'flask-conical']).describe("An appropriate icon name for the concept."),
});

const GlossaryTermSchema = z.object({
  term: z.string().describe('The scientific term.'),
  definition: z.string().describe('A simple, K-12 friendly definition of the term.'),
});

const K12OutputSchema = z.object({
  introduction: z.string().describe('A brief, engaging introduction to the topic for a K-12 audience.'),
  summary: z.string().describe('The main summary of the experiment, written in simple, accessible language.'),
  conclusion: z.string().describe('A short concluding paragraph.'),
  analogy: z.string().describe('A fun and memorable analogy to help students understand the experiment.'),
  memoryTrick: z.string().describe('A memory trick or mnemonic device to help students remember a key concept.'),
  glossary: z.array(GlossaryTermSchema).length(5).describe('A list of exactly 5 key terms and their simple definitions.'),
  conceptMap: z.object({
    centralTopic: z.string().describe('The central topic of the concept map, which is the user\'s query.'),
    relatedConcepts: z.array(ConceptMapNodeSchema).length(4).describe('An array of exactly 4 related concepts.'),
  }),
  quiz: z.object({
    title: z.string().describe('A fun, engaging title for the quiz.'),
    concepts: z.array(QuizConceptSchema).length(4).describe('An array of exactly 4 concepts for the matching game.'),
    definitions: z.array(QuizDefinitionSchema).length(4).describe('An array of exactly 4 definitions corresponding to the concepts.'),
    correctPairs: z.array(CorrectPairSchema).length(4).describe('An array of objects mapping concept IDs to their correct definition IDs.'),
  }),
  learningStyles: z.array(LearningStyleSchema).length(4).describe("An array of exactly 4 tailored suggestions, one for each learning style (Visual, Auditory, Reading/Writing, Kinesthetic)."),
  activities: z.array(ActivitySchema).length(2).describe('An array of exactly 2 creative and practical activities related to the topic.'),
});

// Pro Schemas
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

// Input and Output Schemas for the main flow
const GenerateInteractiveContentInputSchema = z.object({
  query: z.string().describe('The search query for the NASA space biology experiment.'),
  mode: z.enum(['K-12', 'Pro']).describe('The user mode: K-12 for simplified content, Pro for technical content.'),
});
export type GenerateInteractiveContentInput = z.infer<typeof GenerateInteractiveContentInputSchema>;

const GenerateInteractiveContentOutputSchema = z.union([K12OutputSchema, ProOutputSchema]);
export type GenerateInteractiveContentOutput = z.infer<typeof GenerateInteractiveContentOutputSchema>;

// The main exported function
export async function generateInteractiveContent(input: GenerateInteractiveContentInput): Promise<GenerateInteractiveContentOutput> {
  return generateInteractiveContentFlow(input);
}

// The Genkit Prompt
const prompt = ai.definePrompt({
  name: 'generateInteractiveContentPrompt',
  input: { schema: GenerateInteractiveContentInputSchema },
  output: { schema: GenerateInteractiveContentOutputSchema },
  prompt: `You are an AI expert in NASA space biology, tasked with creating a comprehensive and engaging educational experience. Based on the user's query and selected mode, you will generate a structured set of content.

You MUST use real-time, verifiable data from NASA's official sources (like NASA.gov, GeneLab, Task Book) and reputable scientific journals. All URLs must be real and lead to the correct documents.

User Query: {{{query}}}
Mode: {{{mode}}}

**Instructions based on Mode:**

*   **If Mode is 'K-12'**:
    *   Generate all content to be engaging, simple, and suitable for a K-12 audience.
    *   The `glossary`, `conceptMap`, `quiz`, `learningStyles`, and `activities` must be directly and creatively related to the user's query.
    *   Ensure the quiz is a simple matching game with 4 concepts and 4 definitions.
    *   The analogy and memory trick should be fun and easy to remember.

*   **If Mode is 'Pro'**:
    *   Generate all content to be technical, detailed, and suitable for university students and researchers.
    *   The `summary` text MUST include inline citations (e.g., "[1]", "[2]") that correspond to the `sources` array. The 0-indexed position in the array maps to the citation number (e.g., sources[0] is citation "[1]").
    *   The `sources` array must contain at least 3 real, verifiable source documents with direct quotes as snippets.
    *   The `chart` data should be realistic and plausible for the given experiment.
    *   The `researchNavigator` content must be populated with real, relevant studies and datasets from official sources.

Please generate the full output object according to the specified schema for the given mode.`,
});

// The Genkit Flow
const generateInteractiveContentFlow = ai.defineFlow(
  {
    name: 'generateInteractiveContentFlow',
    inputSchema: GenerateInteractiveContentInputSchema,
    outputSchema: GenerateInteractiveContentOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate content from AI.');
    }

    // Add the mode to the output object so the frontend knows how to render it.
    return {
      mode: input.mode,
      ...output,
    };
  }
);
