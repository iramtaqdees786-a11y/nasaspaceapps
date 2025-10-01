'use server';
/**
 * @fileOverview A Genkit flow for generating the text content of a detailed
 * scientific report based on a research query.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePdfReportInputSchema = z.object({
  query: z.string().describe('The research topic for the report.'),
});
export type GeneratePdfReportInput = z.infer<typeof GeneratePdfReportInputSchema>;

const SectionSchema = z.object({
  title: z.string().describe('The title of the section (e.g., "Abstract", "Introduction").'),
  content: z.string().describe('The full text content of the section, formatted with paragraphs.'),
});

const FigureSchema = z.object({
    id: z.string().describe("A unique ID for the figure (e.g., 'fig1')."),
    caption: z.string().describe('A detailed caption for the figure.'),
    data: z.array(z.any()).describe("The data for the figure, can be any format suitable for charting."),
    description: z.string().describe("A description of the data to help in generating a visualization.")
});

const GeneratePdfReportOutputSchema = z.object({
  title: z.string().describe('The main title of the report.'),
  authors: z.array(z.string()).describe('A list of generated author names.'),
  sections: z.array(SectionSchema).describe('An array of content sections for the report.'),
  figures: z.array(FigureSchema).optional().describe("An array of figures, including data and captions."),
  references: z.string().describe('A list of references and citations in a standard scientific format.'),
});
export type GeneratePdfReportOutput = z.infer<typeof GeneratePdfReportOutputSchema>;

export async function generatePdfReport(input: GeneratePdfReportInput): Promise<GeneratePdfReportOutput> {
  return generatePdfReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePdfReportPrompt',
  input: { schema: GeneratePdfReportInputSchema },
  output: { schema: GeneratePdfReportOutputSchema },
  prompt: `You are an AI research assistant. Your task is to generate the complete text content for a detailed, multi-page scientific report based on the provided query. The report should be structured like a formal academic paper, at least 10 pages in length if printed.

Query: {{{query}}}

Please generate the following sections:
- Title
- Authors (generate plausible names)
- Abstract
- Introduction (provide comprehensive background)
- Materials and Methods (describe a plausible methodology in detail)
- Results (describe the findings, referencing figures you will create)
- Discussion (interpret the results and discuss implications)
- Conclusion
- References (list at least 10 real, relevant scientific papers in a standard citation format)

Additionally, define at least two figures (e.g., a chart or diagram) with a unique ID, detailed caption, and a plausible dataset. This data will be used to render the visuals.
`,
});

const generatePdfReportFlow = ai.defineFlow(
  {
    name: 'generatePdfReportFlow',
    inputSchema: GeneratePdfReportInputSchema,
    outputSchema: GeneratePdfReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate PDF report content.');
    }
    return output;
  }
);
