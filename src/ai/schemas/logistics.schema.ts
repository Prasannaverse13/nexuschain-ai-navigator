import {z} from 'genkit';

export const LogisticsInputSchema = z.object({
  shipmentId: z.string().describe('The unique identifier for the shipment.'),
  destination: z.string().describe('The final destination address for the shipment.'),
});

export const LogisticsOutputSchema = z.object({
  optimizedRoute: z.string().describe('A step-by-step description of the optimized delivery route.'),
  estimatedTravelTime: z.string().describe('The estimated time of travel for the new route.'),
  weatherAdvisory: z.string().optional().describe('Any weather-related advisories for the planned route.'),
});
