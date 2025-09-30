import { config } from 'dotenv';
config();

import '@/ai/flows/generate-experiment-summary.ts';
import '@/ai/flows/create-k12-analogy.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/get-daily-feature.ts';
