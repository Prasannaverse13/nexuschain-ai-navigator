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
import {z} from 'genkit';
import { getHistoricalSalesData } from '@/services/bigquery';


export type ForecastDemandInput = z.infer<typeof DemandForecastingInputSchema>;
export type ForecastDemandOutput = z.infer<typeof DemandForecastingOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: {schema: z.object({
    productName: z.string(),
    timePeriod: z.string(),
    historicalData: z.string(),
  })},
  output: {schema: DemandForecastingOutputSchema},
  prompt: `You are an expert supply chain analyst specializing in demand forecasting.

You will use historical sales data and external factors to predict the demand for a specific product during a specified time period.

Product Name: {{{productName}}}
Time Period: {{{timePeriod}}}

Historical Data Analysis:
{{{historicalData}}}

Based on this data, provide a numerical forecast for the demand, a clear rationale explaining the factors influencing the forecast, and a confidence score (0-100) for your prediction.
`,
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: DemandForecastingInputSchema,
    outputSchema: DemandForecastingOutputSchema,
  },
  async (input) => {
    // In a real application, this would fetch live data from BigQuery.
    const historicalData = await getHistoricalSalesData(input.productName);

    const {output} = await prompt({
      productName: input.productName,
      timePeriod: input.timePeriod,
      historicalData: JSON.stringify(historicalData, null, 2),
    });
    return output!;
  }
);
