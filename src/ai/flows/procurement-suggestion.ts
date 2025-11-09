'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating procurement suggestions.
 *
 * - procurementSuggestion - A function that generates optimal raw material orders based on demand forecasts, inventory, and anomaly detection.
 * - ProcurementSuggestionInput - The input type for the procurementSuggestion function.
 * - ProcurementSuggestionOutput - The return type for the procurementSuggestion function.
 */

import {ai} from '@/ai/genkit';
import { ProcurementSuggestionInputSchema, ProcurementSuggestionOutputSchema } from '../schemas/procurement-suggestion.schema';
import type { z } from 'genkit';


export type ProcurementSuggestionInput = z.infer<typeof ProcurementSuggestionInputSchema>;
export type ProcurementSuggestionOutput = z.infer<typeof ProcurementSuggestionOutputSchema>;

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
  Your response should also include a brief cost/benefit analysis for your primary suggestion.
  Please provide a clear, concise summary of suggestions, reasoning, and risk assessment in the proper JSON format.`,
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
