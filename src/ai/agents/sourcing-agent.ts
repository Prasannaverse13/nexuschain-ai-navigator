'use server';
/**
 * @fileOverview The Sourcing Agent, specializing in identifying suppliers and raw material pricing using open internet data.
 * This file is an example of a "Specialist Agent" in the Agent Development Kit (ADK) pattern.
 * It is designed to be called as a tool by an orchestrator agent.
 */
import {ai} from '@/ai/genkit';
import { SourcingAgentOutputSchema, type SourcingAgentInput, type SourcingAgentOutput } from '../schemas/sourcing-agent.schema';


// The main function for this agent
export async function sourcingAgent(input: SourcingAgentInput): Promise<SourcingAgentOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a specialized Sourcing Agent. Your task is to research suppliers and pricing for a given material or component using simulated open internet search.

    Material/Component: "${input.materialOrComponent}"

    1.  Formulate 2-3 diverse search queries to find information on major suppliers, price benchmarks, and recent market news for this item.
    2.  Based on these simulated searches, invent some plausible key findings (e.g., "Major suppliers are concentrated in China and South America.", "Lithium prices have stabilized after a peak in late 2023.", "Recent news indicates a new recycling technology could impact future prices.").
    3.  Return only the search queries and key findings.

    Return the result in the specified JSON format.`,
    output: {
        schema: SourcingAgentOutputSchema
    }
  });

  const output = llmResponse.output;
  if (!output) {
    throw new Error("The Sourcing Agent failed to generate a response.");
  }
  return output;
}
