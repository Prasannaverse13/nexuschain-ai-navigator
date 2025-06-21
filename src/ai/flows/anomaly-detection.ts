'use server';

/**
 * @fileOverview An anomaly detection AI agent. It monitors data streams and alerts to unusual events.
 *
 * - detectAnomaly - A function that handles the anomaly detection process.
 * - DetectAnomalyInput - The input type for the detectAnomaly function.
 * - DetectAnomalyOutput - The return type for the detectAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalyInputSchema = z.object({
  dataStreamDescription: z
    .string()
    .describe('Description of the data stream being monitored.'),
  recentDataSample: z
    .string()
    .describe('A recent sample of data from the stream.'),
});
export type DetectAnomalyInput = z.infer<typeof DetectAnomalyInputSchema>;

const DetectAnomalyOutputSchema = z.object({
  isAnomaly: z.boolean().describe('Whether an anomaly is detected.'),
  anomalyDescription: z
    .string()
    .describe('A description of the detected anomaly, if any.'),
  suggestedActions: z.string().describe('Suggested actions to mitigate the anomaly'),
});
export type DetectAnomalyOutput = z.infer<typeof DetectAnomalyOutputSchema>;

export async function detectAnomaly(input: DetectAnomalyInput): Promise<DetectAnomalyOutput> {
  return detectAnomalyFlow(input);
}

const anomalyDetectionPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  input: {schema: DetectAnomalyInputSchema},
  output: {schema: DetectAnomalyOutputSchema},
  prompt: `You are an expert in supply chain anomaly detection.

You are monitoring the following data stream:
{{{dataStreamDescription}}}

A recent sample from this data stream is:
{{{recentDataSample}}}

Determine if there is an anomaly in the data stream based on the recent sample.
If there is an anomaly, provide a description of the anomaly and suggest actions to mitigate it. Otherwise indicate that no anomaly was detected.

Ensure that the suggested action is appropriate and possible.

Output in JSON format.
`,
});

const detectAnomalyFlow = ai.defineFlow(
  {
    name: 'detectAnomalyFlow',
    inputSchema: DetectAnomalyInputSchema,
    outputSchema: DetectAnomalyOutputSchema,
  },
  async input => {
    const {output} = await anomalyDetectionPrompt(input);
    return output!;
  }
);
