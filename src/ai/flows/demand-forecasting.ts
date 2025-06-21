// src/ai/flows/demand-forecasting.ts
'use server';
/**
 * @fileOverview Demand Forecasting AI agent.
 *
 * - forecastDemand - A function that handles the demand forecasting process.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastDemandInputSchema = z.object({
  productName: z.string().describe('The name of the product to forecast demand for.'),
  timePeriod: z.string().describe('The time period for the demand forecast (e.g., Q3 2024, next month).'),
});
export type ForecastDemandInput = z.infer<typeof ForecastDemandInputSchema>;

const ForecastDemandOutputSchema = z.object({
  forecastedDemand: z
    .number()
    .describe('The forecasted demand for the product during the specified time period.'),
  rationale: z.string().describe('The rationale behind the demand forecast, including factors considered.'),
});
export type ForecastDemandOutput = z.infer<typeof ForecastDemandOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: {schema: ForecastDemandInputSchema},
  output: {schema: ForecastDemandOutputSchema},
  prompt: `You are an expert supply chain analyst specializing in demand forecasting.

You will use historical sales data and external factors to predict the demand for a specific product during a specified time period.

Product Name: {{{productName}}}
Time Period: {{{timePeriod}}}

Consider factors such as historical sales trends, seasonality, marketing campaigns, economic indicators, and competitor activities.

Provide a numerical forecast for the demand and a clear rationale explaining the factors influencing the forecast.
`,
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: ForecastDemandInputSchema,
    outputSchema: ForecastDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
