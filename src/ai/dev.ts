'use server';

import {config} from 'dotenv';
config();

import '@/ai/flows/generate-k12-content.ts';
import '@/ai/flows/generate-pro-content.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/get-daily-feature.ts';
import '@/ai/flows/generate-pdf-report.ts';
