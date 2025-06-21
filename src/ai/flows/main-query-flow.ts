'use server';
/**
 * @fileOverview A central orchestrator flow for NexusChain AI.
 *
 * This flow takes a high-level user query, determines the necessary agent actions,
 * orchestrates their execution by calling them as tools, and returns a comprehensive result
 * including a summary, actionable recommendations, and a detailed workflow breakdown.
 *
 * - mainQuery - The primary function that processes a user's goal.
 * - MainQueryInput - The input type for the mainQuery function.
 * - MainQueryOutput - The return type for the mainQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

import { detectAnomaly } from './anomaly-detection';
import { AnomalyDetectionInputSchema, AnomalyDetectionOutputSchema } from '../schemas/anomaly-detection.schema';
import { forecastDemand } from './demand-forecasting';
import { DemandForecastingInputSchema, DemandForecastingOutputSchema } from '../schemas/demand-forecasting.schema';
import { procurementSuggestion } from './procurement-suggestion';
import { ProcurementSuggestionInputSchema, ProcurementSuggestionOutputSchema } from '../schemas/procurement-suggestion.schema';


// Schemas for the Main Orchestrator Flow
const MainQueryInputSchema = z.object({
  query: z.string().describe('A high-level user query or goal for the supply chain.'),
});
export type MainQueryInput = z.infer<typeof MainQueryInputSchema>;

const WorkflowStepSchema = z.object({
  agent: z.string().describe('The name of the agent that performed the action (e.g., "Demand Forecasting Agent").'),
  icon: z.enum(['BarChartBig', 'AlertTriangle', 'ShoppingCart', 'Truck']).describe("The pre-defined Lucide icon name representing the agent."),
  action: z.string().describe("A short, past-tense summary of the agent's action and its primary result."),
  details: z.string().describe("A more detailed explanation of the agent's findings, the data it used, or the reasoning behind its action."),
  classification: z.string().optional().describe("For anomalies, the type of anomaly (e.g., 'Supplier-driven price increase', 'Market speculation')."),
  confidence: z.number().optional().describe("A confidence score (0-100) for the finding, especially for forecasts or anomaly detections."),
  summary: z.string().optional().describe("An additional summary, like a root cause analysis or cost/benefit breakdown."),
});

const RecommendationSchema = z.object({
    text: z.string().describe("The actionable recommendation text."),
    action: z.string().optional().describe("A suggested button label for a follow-up action, e.g., 'Generate Brief', 'Explore Alternatives'.")
});

const MainQueryOutputSchema = z.object({
  summary: z.string().describe("A concise, high-level summary paragraph that directly answers the user's query."),
  recommendations: z.array(RecommendationSchema).describe("A list of key, actionable recommendations, each with a potential follow-up action."),
  workflow: z.array(WorkflowStepSchema).describe("The sequence of agent steps that were executed to produce the result. The sequence should be logical."),
});
export type MainQueryOutput = z.infer<typeof MainQueryOutputSchema>;


// Define Agent Tools
const anomalyDetectionTool = ai.defineTool(
    {
        name: 'detectAnomaly',
        description: 'Monitors data streams for unusual events and anomalies. Use this to investigate potential issues like price spikes, delays, or quality problems.',
        inputSchema: AnomalyDetectionInputSchema,
        outputSchema: AnomalyDetectionOutputSchema
    },
    async (input) => detectAnomaly(input)
);

const demandForecastingTool = ai.defineTool(
    {
        name: 'forecastDemand',
        description: 'Analyzes historical data and market trends to predict future product demand.',
        inputSchema: DemandForecastingInputSchema,
        outputSchema: DemandForecastingOutputSchema
    },
    async (input) => forecastDemand(input)
);

const procurementSuggestionTool = ai.defineTool(
    {
        name: 'procurementSuggestion',
        description: 'Recommends optimal raw material orders based on forecasts, inventory, and supplier data.',
        inputSchema: ProcurementSuggestionInputSchema,
        outputSchema: ProcurementSuggestionOutputSchema
    },
    async (input) => procurementSuggestion(input)
);

const allTools = [anomalyDetectionTool, demandForecastingTool, procurementSuggestionTool];

// Main Orchestrator Flow
export async function mainQuery(input: MainQueryInput): Promise<MainQueryOutput> {
  return mainQueryFlow(input);
}

const mainQueryFlow = ai.defineFlow(
  {
    name: 'mainQueryFlow',
    inputSchema: MainQueryInputSchema,
    outputSchema: MainQueryOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
        prompt: `You are NexusChain AI, an intelligent supply chain optimization system. Your task is to orchestrate a team of specialized AI agents, which are available to you as tools, to respond to the user's goal.

        User Query: "${input.query}"
        
        Based on the user's query, you must:
        1.  **Analyze the query** to determine what information is needed.
        2.  **Call the necessary tools** in a logical sequence to gather the required data. You can call multiple tools if needed.
        3.  **Synthesize the results** from the tools into a coherent analysis.
        4.  **Generate a final response in JSON format** that strictly adheres to the provided schema. The JSON response must include:
            *   \`summary\`: A concise, high-level summary that directly answers the user's query based on the tool outputs.
            *   \`recommendations\`: A list of key, actionable recommendations.
            *   \`workflow\`: A step-by-step log of the tools you called. For each tool call, create a workflow step object.
                *   You must invent realistic but concise details for the 'action' and 'details' fields based on the tool's input and output.
                *   You MUST use the correct icon for each agent: 'AlertTriangle' for detectAnomaly, 'BarChartBig' for forecastDemand, and 'ShoppingCart' for procurementSuggestion.
        
        Do not invent information that cannot be derived from the tool outputs. Your primary job is to orchestrate, analyze, and present the findings of your agent tools.`,
        tools: allTools,
        output: {
            schema: MainQueryOutputSchema,
        },
    });

    const output = llmResponse.output;
    if (!output) {
      throw new Error("Failed to get a structured response from the AI model.");
    }
    return output;
  }
);
