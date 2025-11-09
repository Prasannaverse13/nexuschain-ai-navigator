'use server';
/**
 * @fileOverview The Delivery Agent, specializing in logistics and transportation analysis using open internet data.
 * This file is an example of a "Specialist Agent" in the Agent Development Kit (ADK) pattern.
 * It is designed to be called as a tool by an orchestrator agent.
 */
import {ai} from '@/ai/genkit';
import { DeliveryAgentOutputSchema, type DeliveryAgentInput, type DeliveryAgentOutput } from '../schemas/delivery-agent.schema';

// The main function for this agent
export async function deliveryAgent(input: DeliveryAgentInput): Promise<DeliveryAgentOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a specialized Delivery Agent. Your task is to analyze logistics and transportation for a given product type and region using simulated open internet search.

    Product Type: "${input.productType}"
    Region: "${input.region}"

    1.  Formulate 2-3 diverse search queries to find information on common shipping routes, logistics challenges, and major ports/hubs in that region for that product type.
    2.  Based on these simulated searches, invent some plausible key findings (e.g., "Key challenge in Southeast Asia for perishables is the 'last-mile' cold chain.", "Port of Singapore is the major hub, but prone to congestion during monsoon season.").
    3.  Return only the search queries and key findings.

    Return the result in the specified JSON format.`,
    output: {
        schema: DeliveryAgentOutputSchema
    }
  });

  const output = llmResponse.output;
  if (!output) {
    throw new Error("The Delivery Agent failed to generate a response.");
  }
  return output;
}
