'use server';

import { generateInteractiveContent } from '@/ai/flows/generate-interactive-content';
import { generatePdfReport } from '@/ai/flows/generate-pdf-report';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { getDailyFeature } from '@/ai/flows/get-daily-feature';
import type { z } from 'zod';
import type { GenerateInteractiveContentOutput } from '@/ai/flows/generate-interactive-content';

// Re-defining schemas here to avoid client-side import of server code.

// SHARED
export type SourceDocument = {
  title: string;
  url: string;
  snippet: string;
};

// K-12
export type Concept = {
  title: string;
  details: string;
  icon: string;
};

export type GlossaryTerm = {
  term: string;
  definition: string;
};

export type K12Result = {
  mode: 'K-12';
  introduction: string;
  summary: string;
  conclusion: string;
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
  };
  learningStyles: {
    style: 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic';
    suggestion: string;
  }[];
  activities: {
    title: string;
    description: string;
  }[];
};

// PRO
export type KeyMetric = {
  name: string;
  value: string;
  unit: string;
};

export type Publication = {
  title:string;
  url: string;
  authors: string[];
}

export type DataSet = {
  name: string;
  url: string;
  description: string;
}

export type ProResult = {
  mode: 'Pro';
  introduction: string;
  summary: string;
  methodology: string;
  futureResearch: string;
  conclusion: string;
  sources: SourceDocument[];
  keyMetrics: KeyMetric[];
  chart: {
    data: { name: string; value1: number; value2: number }[];
    description: string;
    xAxisLabel: string;
    yAxisLabel1: string;
    yAxisLabel2: string;
  };
  researchNavigator: {
    relatedStudies: Publication[];
    dataRepositories: DataSet[];
    keyPublications: Publication[];
  }
};

export type SearchResult = K12Result | ProResult;

export type AudioResult = {
  media: string;
};

export type DailyFeature = {
    title: string;
    content: string;
};

export async function getExperimentData(query: string, mode: 'K-12' | 'Pro'): Promise<SearchResult> {
  if (!query) {
    throw new Error('Search query cannot be empty.');
  }

  try {
    const result = await generateInteractiveContent({ query, mode });
    
    // The result from the flow already includes the 'mode' property.
    return result as SearchResult;

  } catch (error) {
    console.error('Error fetching experiment data:', error);
    throw new Error('Failed to fetch data from AI. Please try again.');
  }
}

export async function getAudioSummary(text: string): Promise<AudioResult> {
    if (!text) {
        throw new Error('No text provided for audio summary.');
    }
    try {
        const audioResult = await textToSpeech(text);
        return audioResult;
    } catch (error) {
        console.error('Error generating audio summary:', error);
        throw new Error('Failed to generate audio. Please try again.');
    }
}

export async function fetchDailyFeature(mode: 'K-12' | 'Pro'): Promise<DailyFeature> {
    try {
        const feature = await getDailyFeature({ mode });
        return feature;
    } catch (error) {
        console.error('Error fetching daily feature:', error);
        return {
            title: 'Content not available',
            content: 'Could not load the daily feature. Please try again later.'
        };
    }
}

export async function getPdfReportContent(query: string): Promise<any> {
    if (!query) {
        throw new Error('Query cannot be empty.');
    }
    try {
        const reportContent = await generatePdfReport({ query });
        return reportContent;
    } catch (error) {
        console.error('Error generating PDF report content:', error);
        throw new Error('Failed to generate report content.');
    }
}
