'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a rich, interactive set of content
 * for the AstroBio Explorer, tailored for K-12 audiences.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SourceDocumentSchema = z.object({
  title: z.string().describe('The title of the source document.'),
  url: z.string().describe('The direct URL to the source document (must be a real, accessible NASA link or a link to a scientific paper).'),
});

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
    icon: z.enum(['dna', 'thermometer', 'clipboard-check', 'flask-conical', 'rocket', 'atom', 'telescope', 'sprout']).describe("An appropriate icon name for the concept."),
});

const GlossaryTermSchema = z.object({
  term: z.string().describe('The scientific term.'),
  definition: z.string().describe('A simple, K-12 friendly definition of the term.'),
});

const K12InputSchema = z.object({
  query: z.string().describe('The search query for the NASA space biology experiment.'),
});

const K12OutputSchema = z.object({
  introduction: z.string().describe('A brief, engaging introduction to the topic for a K-12 audience.'),
  summary: z.string().describe('The main summary of the experiment, written in simple, accessible language.'),
  conclusion: z.string().describe('A short concluding paragraph.'),
  analogy: z.string().describe('A fun and memorable analogy to help students understand the experiment.'),
  memoryTrick: z.string().describe('A memory trick or mnemonic device to help students remember a key concept.'),
  glossary: z.array(GlossaryTermSchema).describe('A list of key terms and their simple definitions.'),
  conceptMap: z.object({
    centralTopic: z.string().describe('The central topic of the concept map, which is the user\'s query.'),
    relatedConcepts: z.array(ConceptMapNodeSchema).describe('An array of related concepts.'),
  }),
  quiz: z.object({
    title: z.string().describe('A fun, engaging title for the quiz.'),
    concepts: z.array(QuizConceptSchema).describe('An array of concepts for the matching game.'),
    definitions: z.array(QuizDefinitionSchema).describe('An array of definitions corresponding to the concepts.'),
    correctPairs: z.array(CorrectPairSchema).describe('An array of objects mapping concept IDs to their correct definition IDs.'),
  }),
  learningStyles: z.array(LearningStyleSchema).describe("An array of tailored suggestions for different learning styles."),
  activities: z.array(ActivitySchema).describe('An array of creative and practical activities related to the topic.'),
  sources: z.array(SourceDocumentSchema).describe('A list of real source documents (preferably reports) used to generate the summary.'),
});

export type K12Result = z.infer<typeof K12OutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateK12ContentPrompt',
  input: { schema: K12InputSchema },
  output: { schema: K12OutputSchema },
  prompt: `You are an AI expert in NASA space biology, tasked with creating a comprehensive and engaging educational experience for a K-12 audience. Based on the user's query, you will generate a structured set of content.

You MUST use real-time, verifiable data from NASA's official sources (like NASA.gov, GeneLab) and reputable scientific journals, but simplify all concepts for the target audience.

User Query: {{{query}}}

**Instructions**:
*   Generate all content to be engaging, simple, and suitable for a K-12 audience.
*   The 'glossary', 'conceptMap', 'quiz', 'learningStyles', 'activities', and 'sources' must be directly and creatively related to the user's query.
*   Generate about 5 glossary terms, 6 concept map nodes, a 4x4 quiz, 2 activities, and at least 2 sources.
*   The analogy and memory trick should be fun and easy to remember.

Please generate the full output object according to the specified schema.`,
});

const generateK12ContentFlow = ai.defineFlow(
  {
    name: 'generateK12ContentFlow',
    inputSchema: K12InputSchema,
    outputSchema: K12OutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate K-12 content from AI.');
    }
    return output;
  }
);

export async function generateK12Content(input: z.infer<typeof K12InputSchema>): Promise<K12Result> {
  return generateK12ContentFlow(input);
}
