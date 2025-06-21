'use server';

/**
 * @fileOverview A logistics agent for planning and optimizing delivery routes.
 *
 * - planRoute - A function that handles route planning based on various factors.
 * - LogisticsInput - The input type for the planRoute function.
 * - LogisticsOutput - The return type for the planRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { LogisticsInputSchema, LogisticsOutputSchema } from '../schemas/logistics.schema';
import type { z as zod } from 'genkit';

export type LogisticsInput = zod.infer<typeof LogisticsInputSchema>;
export type LogisticsOutput = zod.infer<typeof LogisticsOutputSchema>;

// This is a mock tool. In a real application, this would call a weather API.
const getWeatherConditions = ai.defineTool(
    {
        name: 'getWeatherConditions',
        description: 'Gets the current weather conditions for a given location.',
        inputSchema: z.object({ location: z.string() }),
        outputSchema: z.string(),
    },
    async ({ location }) => {
        // In a real app, you'd fetch this from a weather service.
        if (location.toLowerCase().includes("denver")) {
            return "Heavy snowfall advisory in effect. Major roads are slow."
        }
        return "Clear skies, light traffic reported."
    }
)

const planRoutePrompt = ai.definePrompt({
    name: 'planRoutePrompt',
    input: {schema: LogisticsInputSchema},
    output: {schema: LogisticsOutputSchema},
    tools: [getWeatherConditions],
    prompt: `You are a logistics expert specializing in route optimization.

    Your task is to plan the most efficient and safest delivery route for shipment {{{shipmentId}}} to its destination: {{{destination}}}.

    1. First, use the getWeatherConditions tool to check the weather at the destination.
    2. Based on the weather, plan an optimized route.
    3. If there are adverse weather conditions, your route must avoid the affected areas, and you must include a 'weatherAdvisory'.
    4. Provide a step-by-step description of the route and an estimated travel time.
    `,
});

const planRouteFlow = ai.defineFlow(
  {
    name: 'planRouteFlow',
    inputSchema: LogisticsInputSchema,
    outputSchema: LogisticsOutputSchema,
  },
  async input => {
    const {output} = await planRoutePrompt(input);
    return output!;
  }
);

export async function planRoute(input: LogisticsInput): Promise<LogisticsOutput> {
    return planRouteFlow(input);
}
