'use server';

import { generateK12Content } from '@/ai/flows/generate-k12-content';
import { generateProContent } from '@/ai/flows/generate-pro-content';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { getDailyFeature } from '@/ai/flows/get-daily-feature';
import { analyzeDocument as analyzeDocumentFlow } from '@/ai/flows/analyze-document-flow';
import type { K12Result as K12ContentType } from '@/ai/flows/generate-k12-content';
import type { ProResult as ProContentType } from '@/ai/flows/generate-pro-content';
import type { AudioResult as AudioResultType } from '@/lib/types';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';


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

export type K12Result = K12ContentType & { mode: 'K-12' };

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

export type ProResult = ProContentType & { mode: 'Pro' };

export type SearchResult = K12Result | ProResult;

export type AudioResult = AudioResultType;

export type DailyFeature = {
    title: string;
    content: string;
};


async function withApiKeyFallback<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Check if the error indicates an API key issue
    if (error.message && (error.message.includes('API key not valid') || error.message.includes('permission denied'))) {
      console.log('Primary API key failed. Trying backup key.');

      // Temporarily re-configure Genkit with the backup key
      genkit({
        plugins: [
          googleAI({
            apiKey: process.env.GEMINI_BACKUP_API_KEY,
          }),
        ],
        model: 'googleai/gemini-2.5-flash',
      });
      
      // Retry the function
      return await fn();
    }
    // If it's a different error, just re-throw it
    throw error;
  } finally {
      // Always restore the primary key configuration
      genkit({
        plugins: [
          googleAI({
            apiKey: process.env.GEMINI_API_KEY,
          }),
        ],
        model: 'googleai/gemini-2.5-flash',
      });
  }
}

export async function getExperimentData(query: string, mode: 'K-12' | 'Pro'): Promise<SearchResult> {
  if (!query) {
    throw new Error('Search query cannot be empty.');
  }

  return withApiKeyFallback(async () => {
    try {
      if (mode === 'K-12') {
          const result = await generateK12Content({ query });
          return { ...result, mode: 'K-12' };
      } else {
          const result = await generateProContent({ query });
          return { ...result, mode: 'Pro' };
      }
    } catch (error) {
      console.error('Error fetching experiment data:', error);
      throw new Error('Failed to fetch data from AI. Please try again.');
    }
  });
}

export async function getAudioSummary(text: string): Promise<AudioResult> {
    if (!text) {
        throw new Error('No text provided for audio summary.');
    }
    return withApiKeyFallback(async () => {
      try {
          const audioResult = await textToSpeech(text);
          return audioResult;
      } catch (error) {
          console.error('Error generating audio summary:', error);
          throw new Error('Failed to generate audio. Please try again.');
      }
    });
}

export async function fetchDailyFeature(mode: 'K-12' | 'Pro'): Promise<DailyFeature> {
    // This function doesn't call the AI, so no fallback needed.
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

export async function analyzeDocument(fileDataUri: string, fileName: string): Promise<ProResult> {
  if (!fileDataUri) {
    throw new Error('No file provided for analysis.');
  }

  return withApiKeyFallback(async () => {
    try {
      const result = await analyzeDocumentFlow({ fileDataUri, fileName });
      return { ...result, mode: 'Pro' };
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document with AI. Please try again.');
    }
  });
}
