'use server';
/**
 * @fileOverview The Anomaly Detection Agent, specializing in identifying unusual events in data streams.
 * This file is an example of a "Specialist Agent" in the Agent Development Kit (ADK) pattern.
 * It is designed to be called as a tool by an orchestrator agent.
 */
import { ai } from '@/ai/genkit';
import { AnomalyDetectionAgentOutputSchema, type AnomalyDetectionAgentInput, type AnomalyDetectionAgentOutput } from '../schemas/anomaly-detection-agent.schema';

// The main function for this agent
export async function anomalyDetectionAgent(input: AnomalyDetectionAgentInput): Promise<AnomalyDetectionAgentOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a specialized Anomaly Detection Agent. Your task is to analyze a data stream description and sample to identify unusual events.

    Data Stream: "${input.dataStreamDescription}"

    1. Formulate 1-2 search queries to find baseline information or recent news about this data stream.
    2. Based on a simulated analysis, determine if there are any anomalies.
    3. If an anomaly is found, invent a plausible classification (e.g., 'Market speculation', 'Geopolitical impact') and a confidence score.
    4. Return only the search queries and key findings.

    Return the result in the specified JSON format.`,
    output: {
        schema: AnomalyDetectionAgentOutputSchema
    }
  });

  const output = llmResponse.output;
  if (!output) {
    throw new Error("The Anomaly Detection Agent failed to generate a response.");
  }
  return output;
}
