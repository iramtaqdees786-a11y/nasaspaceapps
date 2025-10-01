import {z} from "genkit";

// TEXT-TO-SPEECH
export const AudioResultSchema = z.object({
  media: z.string().describe("The base64 encoded audio data URI."),
});
export type AudioResult = z.infer<typeof AudioResultSchema>;


// PRO CONTENT
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

const ChartSchema = z.object({
  data: z.array(ChartDataPointSchema).min(5).describe('An array of at least 5 data points for the chart.'),
  description: z.string().describe('A brief, insightful description of what the chart visualizes.'),
  xAxisLabel: z.string().describe("The label for the chart's X-axis."),
  yAxisLabel1: z.string().describe("The label for the primary Y-axis (for value1)."),
  yAxisLabel2: z.string().describe("The label for the secondary Y-axis (for value2)."),
});


export const ProOutputSchema = z.object({
  introduction: z.string().describe('A concise, technical introduction to the experiment or topic.'),
  summary: z.string().describe('The main technical summary. This text may contain bracketed, numbered citations like "[1]", "[2]", etc. These citations must correspond to the `sources` array.'),
  methodology: z.string().describe("A detailed summary of the experiment's methodology."),
  futureResearch: z.string().describe("Potential future research directions based on the experiment's findings."),
  conclusion: z.string().describe('A technical conclusion summarizing the key takeaways.'),
  sources: z.array(SourceDocumentSchema).min(3).describe('A list of at least 3 real source documents used to generate the summary. The snippets should be directly quoted from the source.'),
  keyMetrics: z.array(KeyMetricSchema).length(3).describe('An array of exactly 3 key metrics relevant to the experiment.'),
  barChart: ChartSchema,
  areaChart: ChartSchema,
  researchNavigator: z.object({
    relatedStudies: z.array(PublicationSchema).length(3).describe("A list of exactly 3 related studies from the NASA Task Book or similar sources."),
    dataRepositories: z.array(DataSetSchema).length(2).describe("A list of exactly 2 relevant data repositories."),
    keyPublications: z.array(PublicationSchema).length(2).describe("A list of exactly 2 key, seminal publications in this research area."),
  }),
});
