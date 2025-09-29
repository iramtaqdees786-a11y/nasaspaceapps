export type Concept = {
  title: string;
  details: string;
  icon: string;
};

export type K12Result = {
  mode: 'K-12';
  summary: string;
  analogy: string;
  memoryTrick: string;
  conceptMap: {
    centralTopic: string;
    relatedConcepts: Concept[];
  };
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

export type ProResult = {
  mode: 'Pro';
  summary: string;
  chartData: { name: string; [key: string]: any }[];
  publications: Publication[];
  datasets: DataSet[];
  keyMetrics: KeyMetric[];
};

export type SearchResult = K12Result | ProResult;

export type AudioResult = {
  media: string;
};
