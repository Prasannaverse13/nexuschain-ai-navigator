'use server';

/**
 * @fileOverview An anomaly detection AI agent. It monitors data streams and alerts to unusual events.
 *
 * - detectAnomaly - A function that handles the anomaly detection process.
 * - DetectAnomalyInput - The input type for the detectAnomaly function.
 * - DetectAnomalyOutput - The return type for the detectAnomaly function.
 */

import {ai} from '@/ai/genkit';
import { AnomalyDetectionInputSchema, AnomalyDetectionOutputSchema } from '../schemas/anomaly-detection.schema';
import type { z } from 'genkit';

export type DetectAnomalyInput = z.infer<typeof AnomalyDetectionInputSchema>;
export type DetectAnomalyOutput = z.infer<typeof AnomalyDetectionOutputSchema>;

export async function detectAnomaly(input: DetectAnomalyInput): Promise<DetectAnomalyOutput> {
  return detectAnomalyFlow(input);
}

const anomalyDetectionPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  input: {schema: AnomalyDetectionInputSchema},
  output: {schema: AnomalyDetectionOutputSchema},
  prompt: `You are an expert in supply chain anomaly detection.

You are monitoring the following data stream:
{{{dataStreamDescription}}}

A recent sample from this data stream is:
{{{recentDataSample}}}

Based on this, perform the following:
1.  Determine if there is an anomaly.
2.  If an anomaly is detected:
    a. Describe the anomaly clearly.
    b. Suggest concrete actions to mitigate it.
    c. Provide a confidence score (0-100) for your detection.
    d. Classify the anomaly (e.g., 'Supplier-driven price increase', 'Market speculation', 'Logistical delay', 'Quality control issue').
    e. Provide a brief summary of the potential root cause, using your analytical abilities to infer possibilities.
3.  If no anomaly is detected, clearly state that.

Output in JSON format.
`,
});

const detectAnomalyFlow = ai.defineFlow(
  {
    name: 'detectAnomalyFlow',
    inputSchema: AnomalyDetectionInputSchema,
    outputSchema: AnomalyDetectionOutputSchema,
  },
  async input => {
    const {output} = await anomalyDetectionPrompt(input);
    return output!;
  }
);
