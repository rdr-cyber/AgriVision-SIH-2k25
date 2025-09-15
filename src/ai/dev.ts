import { config } from 'dotenv';
config({ path: '.env' });

import '@/ai/flows/ai-species-and-quality-analysis.ts';
import '@/ai/flows/qc-agent-reviews-ai-outputs.ts';