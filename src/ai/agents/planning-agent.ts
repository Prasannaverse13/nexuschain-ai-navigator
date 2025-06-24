'use server';
/**
 * @fileOverview The Planning Agent, specializing in demand forecasting and production scheduling analysis using open internet data.
 * This file is an example of a "Specialist Agent" in the Agent Development Kit (ADK) pattern.
 * It is designed to be called as a tool by an orchestrator agent.
 */
import {ai} from '@/ai/genkit';
import { PlanningAgentOutputSchema, type PlanningAgentInput, type PlanningAgentOutput } from '../schemas/planning-agent.schema';


// The main function for this agent
export async function planningAgent(input: PlanningAgentInput): Promise<PlanningAgentOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a specialized Planning Agent. Your task is to analyze the demand and planning aspects for a given product topic using simulated open internet search.

    Product Topic: "${input.productTopic}"

    1.  Formulate 2-3 diverse search queries to gather data on market trends, demand drivers, and common planning challenges for this topic.
    2.  Based on these simulated searches, invent some plausible key findings (e.g., "Market reports show a 15% year-over-year growth in the electric scooter market in APAC.", "Key demand drivers include urban mobility trends and environmental concerns.").
    3.  Return only the search queries and key findings.

    Return the result in the specified JSON format.`,
    output: {
        schema: PlanningAgentOutputSchema
    }
  });

  const output = llmResponse.output;
  if (!output) {
    throw new Error("The Planning Agent failed to generate a response.");
  }
  return output;
}
