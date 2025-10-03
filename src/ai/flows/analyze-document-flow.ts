'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing an uploaded research document
 * and generating a structured professional/research-level summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ProOutputSchema } from "@/lib/types";

const AnalyzeDocumentInputSchema = z.object({
  fileName: z.string().describe("The name of the uploaded file."),
  fileDataUri: z.string().describe("A PDF file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."),
});

export type ProResult = z.infer<typeof ProOutputSchema>;

const prompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: { schema: AnalyzeDocumentInputSchema },
  output: { schema: ProOutputSchema },
  prompt: `You are an AI expert in scientific research analysis, specializing in space biology. Your task is to analyze the provided research document and create a comprehensive and technical summary suitable for university students and researchers.

You MUST derive all information directly from the provided document. Do not use external knowledge unless it is to find real URLs for citations if they are mentioned but not linked.

Document: {{{fileName}}}
{{media url=fileDataUri}}

**Instructions**:
*   Analyze the document and generate a full, structured output according to the schema.
*   The 'introduction', 'summary', 'methodology', 'futureResearch', and 'conclusion' sections must be derived entirely from the document's content.
*   Identify key sentences or findings and list them as 'sources' with snippets. If the document has a title, use it. For the URL, use a placeholder or find a real one if a DOI is provided.
*   Extract or generate plausible 'keyMetrics' from the document's data.
*   Generate two distinct and plausible charts ('barChart', 'areaChart') based on data or trends described in the document.
*   Based on the document's content, populate the 'researchNavigator' with plausible (but not necessarily real unless mentioned) related studies, data repositories, and key publications.

Please generate the full output object according to the specified schema.`,
});

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: ProOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate analysis from AI for the provided document.');
    }
    return output;
  }
);

export async function analyzeDocument(input: z.infer<typeof AnalyzeDocumentInputSchema>): Promise<ProResult> {
    return analyzeDocumentFlow(input);
}
