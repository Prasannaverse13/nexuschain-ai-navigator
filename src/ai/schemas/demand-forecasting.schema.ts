import {z} from 'genkit';

export const DemandForecastingInputSchema = z.object({
  productName: z.string().describe('The name of the product to forecast demand for.'),
  timePeriod: z.string().describe('The time period for the demand forecast (e.g., Q3 2024, next month).'),
});

export const DemandForecastingOutputSchema = z.object({
  forecastedDemand: z
    .number()
    .describe('The forecasted demand for the product during the specified time period.'),
  rationale: z.string().describe('The rationale behind the demand forecast, including factors considered.'),
  confidence: z.number().optional().describe("A confidence score (0-100) for the forecast."),
});
