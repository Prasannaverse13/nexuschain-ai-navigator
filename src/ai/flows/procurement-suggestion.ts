'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating procurement suggestions.
 *
 * - procurementSuggestion - A function that generates optimal raw material orders based on demand forecasts, inventory, and anomaly detection.
 * - ProcurementSuggestionInput - The input type for the procurementSuggestion function.
 * - ProcurementSuggestionOutput - The return type for the procurementSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcurementSuggestionInputSchema = z.object({
  demandForecast: z
    .string()
    .describe('The demand forecast for the upcoming period.'),
  currentInventory: z
    .string()
    .describe('The current inventory levels of raw materials.'),
  inventoryThreshold: z
    .string()
    .describe(
      'The minimum inventory threshold for each raw material before reordering.'
    ),
  anomalyInformation: z
    .string()
    .optional()
    .describe(
      'Information about any anomalies detected in the supply chain (e.g., price spikes, delays).'
    ),
});
export type ProcurementSuggestionInput = z.infer<
  typeof ProcurementSuggestionInputSchema
>;

const ProcurementSuggestionOutputSchema = z.object({
  suggestedOrders: z.string().describe(
    'A list of suggested orders for raw materials, including quantity and supplier recommendations.'
  ),
  reasoning: z.string().describe('The reasoning behind the suggested orders.'),
  riskAssessment: z
    .string()
    .optional()
    .describe(
      'An assessment of potential risks associated with the suggested orders (e.g., supplier reliability, price volatility).'
    ),
});
export type ProcurementSuggestionOutput = z.infer<
  typeof ProcurementSuggestionOutputSchema
>;

export async function procurementSuggestion(
  input: ProcurementSuggestionInput
): Promise<ProcurementSuggestionOutput> {
  return procurementSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'procurementSuggestionPrompt',
  input: {schema: ProcurementSuggestionInputSchema},
  output: {schema: ProcurementSuggestionOutputSchema},
  prompt: `You are an AI-powered procurement assistant designed to suggest optimal raw material orders.

  Based on the following information, provide a list of suggested orders, your reasoning, and a risk assessment.

  Demand Forecast: {{{demandForecast}}}
  Current Inventory: {{{currentInventory}}}
  Inventory Threshold: {{{inventoryThreshold}}}
  Anomalies: {{{anomalyInformation}}}

  Consider all factors to minimize costs, avoid stockouts, and mitigate risks.
  Please provide a clear, concise summary of suggestions, reasoning, and risk assessment.`,
});

const procurementSuggestionFlow = ai.defineFlow(
  {
    name: 'procurementSuggestionFlow',
    inputSchema: ProcurementSuggestionInputSchema,
    outputSchema: ProcurementSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
