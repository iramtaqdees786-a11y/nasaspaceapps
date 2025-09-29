'use server';

import { generateExperimentSummary } from '@/ai/flows/generate-experiment-summary';
import { createK12Analogy } from '@/ai/flows/create-k12-analogy';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { AudioResult, K12Result, ProResult } from '@/lib/types';

export async function getExperimentData(query: string, mode: 'K-12' | 'Pro'): Promise<K12Result | ProResult> {
  if (!query) {
    throw new Error('Search query cannot be empty.');
  }

  try {
    const summaryPromise = generateExperimentSummary({ query, mode });

    if (mode === 'K-12') {
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
            { title: 'Organisms', details: 'e.g., plants, microbes', icon: 'dna' },
            { title: 'Environment', details: 'e.g., microgravity, radiation', icon: 'thermometer' },
            { title: 'Key Findings', details: 'Primary results of study', icon: 'clipboard-check' },
            { title: 'Applications', details: 'Earth & space applications', icon: 'flask-conical' },
          ],
        },
      };
    } else {
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
        publications: [
          { title: 'Microgravity effects on Arabidopsis thaliana.', url: '#', authors: ['First, A.', 'Second, B.'] },
          { title: 'Radiation damage in space-grown lettuce.', url: '#', authors: ['Third, C.'] },
        ],
        datasets: [
            { name: 'GeneLab GLDS-123', url: '#', description: 'Transcriptomics of plant shoots in space.'},
            { name: 'NASA Data Repository', url: '#', description: 'Environmental data from the ISS.'},
        ],
        keyMetrics: [
            { name: 'Total Sample Size', value: '150', unit: 'plants' },
            { name: 'Mission Duration', value: '42', unit: 'days' },
            { name: 'Avg. Radiation', value: '5.6', unit: 'mGy/day' },
        ]
      };
    }
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
