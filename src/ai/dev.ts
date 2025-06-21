import { config } from 'dotenv';
config();

import '@/ai/flows/procurement-suggestion.ts';
import '@/ai/flows/anomaly-detection.ts';
import '@/ai/flows/demand-forecasting.ts';