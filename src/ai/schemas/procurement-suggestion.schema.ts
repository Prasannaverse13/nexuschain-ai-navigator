import {z} from 'genkit';

export const ProcurementSuggestionInputSchema = z.object({
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

export const ProcurementSuggestionOutputSchema = z.object({
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
  costBenefitAnalysis: z.string().optional().describe("A summary of the cost/benefit analysis for the suggestion."),
});
