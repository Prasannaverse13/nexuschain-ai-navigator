'use server';
/**
 * @fileOverview The Manufacturing Agent, specializing in production processes and quality control.
 * This file is an example of a "Specialist Agent" in the Agent Development Kit (ADK) pattern.
 * It is designed to be called as a tool by an orchestrator agent.
 */
import { ai } from '@/ai/genkit';
import { ManufacturingAgentOutputSchema, type ManufacturingAgentInput, type ManufacturingAgentOutput } from '../schemas/manufacturing-agent.schema';

// The main function for this agent
export async function manufacturingAgent(input: ManufacturingAgentInput): Promise<ManufacturingAgentOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a specialized Manufacturing Agent. Your task is to research production best practices for a given product type using simulated open internet search.

    Product Type: "${input.productType}"

    1. Formulate 2-3 diverse search queries to find information on common manufacturing processes, quality control standards (like ISO 9001), and average production times for this product type.
    2. Based on these simulated searches, invent some plausible key findings (e.g., "Lean manufacturing principles are widely adopted to reduce waste.", "For electronics, ISO 9001 and IPC-A-610 are key quality standards.", "Average production cycle time from component assembly to final product is 48 hours.").
    3. Return only the search queries and key findings.

    Return the result in the specified JSON format.`,
    output: {
        schema: ManufacturingAgentOutputSchema
    }
  });

  const output = llmResponse.output;
  if (!output) {
    throw new Error("The Manufacturing Agent failed to generate a response.");
  }
  return output;
}
