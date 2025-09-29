'use server';

import { generateExperimentSummary } from '@/ai/flows/generate-experiment-summary';
import { createK12Analogy } from '@/ai/flows/create-k12-analogy';
import type { K12Result, ProResult } from '@/lib/types';

export async function getExperimentData(query: string, mode: 'K-12' | 'Pro'): Promise<K12Result | ProResult> {
  if (!query) {
    throw new Error('Search query cannot be empty.');
  }

  try {
    const summaryPromise = generateExperimentSummary({ query, mode });

    if (mode === 'K-12') {
      // For K-12, we also generate an analogy. We can use the query as the basis for the experiment description.
      const analogyPromise = createK12Analogy({ experimentDescription: query });

      const [summaryResult, analogyResult] = await Promise.all([summaryPromise, analogyPromise]);

      return {
        mode: 'K-12',
        summary: summaryResult.summary,
        analogy: analogyResult.analogy,
        memoryTrick: analogyResult.memoryTrick,
        conceptMap: {
          centralTopic: query,
          relatedConcepts: [
            { title: 'Organisms', details: 'e.g., plants, microbes, animals', icon: 'dna' },
            { title: 'Conditions', details: 'e.g., microgravity, radiation', icon: 'thermometer' },
            { title: 'Findings', details: 'Key results from the study', icon: 'clipboard-check' },
            { title: 'Technology', details: 'Hardware and methods used', icon: 'flask-conical' },
          ],
        },
      };
    } else {
      // For Pro mode, we only need the technical summary and will generate mock chart data.
      const summaryResult = await summaryPromise;

      return {
        mode: 'Pro',
        summary: summaryResult.summary,
        chartData: [
          { name: 'Day 1', growth: 40, radiation: 24 },
          { name: 'Day 7', growth: 30, radiation: 13 },
          { name: 'Day 14', growth: 20, radiation: 98 },
          { name: 'Day 21', growth: 27, radiation: 39 },
          { name: 'Day 28', growth: 18, radiation: 48 },
          { name: 'Day 35', growth: 23, radiation: 38 },
          { name: 'Day 42', growth: 34, radiation: 43 },
        ],
      };
    }
  } catch (error) {
    console.error('Error fetching experiment data:', error);
    throw new Error('Failed to fetch data from AI. Please try again.');
  }
}
