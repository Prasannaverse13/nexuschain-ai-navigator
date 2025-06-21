'use server';
/**
 * @fileOverview Demand Forecasting AI agent.
 *
 * - forecastDemand - A function that handles the demand forecasting process.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import {ai} from '@/ai/genkit';
import { DemandForecastingInputSchema, DemandForecastingOutputSchema } from '../schemas/demand-forecasting.schema';
import type { z } from 'genkit';


export type ForecastDemandInput = z.infer<typeof DemandForecastingInputSchema>;
export type ForecastDemandOutput = z.infer<typeof DemandForecastingOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: {schema: DemandForecastingInputSchema},
  output: {schema: DemandForecastingOutputSchema},
  prompt: `You are an expert supply chain analyst specializing in demand forecasting.

You will use historical sales data and external factors to predict the demand for a specific product during a specified time period.

Product Name: {{{productName}}}
Time Period: {{{timePeriod}}}

Consider factors such as historical sales trends, seasonality, marketing campaigns, economic indicators, and competitor activities.

Provide a numerical forecast for the demand, a clear rationale explaining the factors influencing the forecast, and a confidence score (0-100) for your prediction.
`,
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: DemandForecastingInputSchema,
    outputSchema: DemandForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
