'use server';
/**
 * @fileOverview The Inventory Agent, specializing in researching optimal inventory levels and strategies.
 * This file is an example of a "Specialist Agent" in the Agent Development Kit (ADK) pattern.
 * It is designed to be called as a tool by an orchestrator agent.
 */
import { ai } from '@/ai/genkit';
import { InventoryAgentOutputSchema, type InventoryAgentInput, type InventoryAgentOutput } from '../schemas/inventory-agent.schema';

// The main function for this agent
export async function inventoryAgent(input: InventoryAgentInput): Promise<InventoryAgentOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a specialized Inventory Management Agent. Your task is to research optimal stock levels and strategies for a given product type using simulated open internet search.

    Product Type: "${input.productType}"

    1. Formulate 2-3 diverse search queries to find information on industry average inventory turnover rates, common strategies like Just-in-Time (JIT) or Lean, and typical buffer stock recommendations for this product type.
    2. Based on these simulated searches, invent some plausible key findings (e.g., "The industry average inventory turnover for consumer electronics is around 6.5.", "JIT is effective but requires highly reliable suppliers, which might be a risk.", "A buffer stock of 15% is recommended to mitigate minor supply chain disruptions.").
    3. Return only the search queries and key findings.

    Return the result in the specified JSON format.`,
    output: {
        schema: InventoryAgentOutputSchema
    }
  });

  const output = llmResponse.output;
  if (!output) {
    throw new Error("The Inventory Agent failed to generate a response.");
  }
  return output;
}
