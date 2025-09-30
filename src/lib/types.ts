export type Concept = {
  title: string;
  details: string;
  icon: string;
};

export type GlossaryTerm = {
  term: string;
  definition: string;
}

export type K12Result = {
  mode: 'K-12';
  summary: string;
  analogy: string;
  memoryTrick: string;
  glossary: GlossaryTerm[];
  conceptMap: {
    centralTopic: string;
    relatedConcepts: Concept[];
  };
  quiz: {
    title: string;
    concepts: { id: string; text: string }[];
    definitions: { id: string; text: string }[];
    correctPairs: { conceptId: string; definitionId: string }[];
  }
};

export type Publication = {
  title: string;
  url: string;
  authors: string[];
};

export type DataSet = {
  name: string;
  url: string;
  description: string;
};

export type KeyMetric = {
  name: string;
  value: string;
  unit: string;
};

export type SourceDocument = {
  title: string;
  url: string;
  snippet: string;
};

export type ProResult = {
  mode: 'Pro';
  summary: string;
  methodology: string;
  futureResearch: string;
  sources: SourceDocument[];
  chartData: { name: string; [key: string]: any }[];
  publications: Publication[];
  datasets: DataSet[];
  keyMetrics: KeyMetric[];
  chartDescription: string;
  chartImageUrl: string;
  pdfUrl: string;
};

export type SearchResult = K12Result | ProResult;

export type AudioResult = {
  media: string;
};

export type DailyFeature = {
    title: string;
    content: string;
};
