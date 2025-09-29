import type { LucideIcon } from "lucide-react";

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

export type ProResult = {
  mode: 'Pro';
  summary: string;
  chartData: { name: string; [key: string]: any }[];
};

export type SearchResult = K12Result | ProResult;
