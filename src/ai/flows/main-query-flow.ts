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

import { detectAnomaly, type DetectAnomalyInput, type DetectAnomalyOutput } from './anomaly-detection';
import { AnomalyDetectionInputSchema, AnomalyDetectionOutputSchema } from '../schemas/anomaly-detection.schema';
import { forecastDemand, type ForecastDemandInput, type ForecastDemandOutput } from './demand-forecasting';
import { DemandForecastingInputSchema, DemandForecastingOutputSchema } from '../schemas/demand-forecasting.schema';
import { procurementSuggestion, type ProcurementSuggestionInput, type ProcurementSuggestionOutput } from './procurement-suggestion';
import { ProcurementSuggestionInputSchema, ProcurementSuggestionOutputSchema } from '../schemas/procurement-suggestion.schema';
import { planRoute, type LogisticsInput, type LogisticsOutput } from './logistics';
import { LogisticsInputSchema, LogisticsOutputSchema } from '../schemas/logistics.schema';


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
  summary: z.string().describe("A concise, high-level summary that directly answers the user's query."),
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
    async (input: DetectAnomalyInput) => detectAnomaly(input)
);

const demandForecastingTool = ai.defineTool(
    {
        name: 'forecastDemand',
        description: 'Analyzes historical data and market trends to predict future product demand. Retrieves data from data warehouse.',
        inputSchema: DemandForecastingInputSchema,
        outputSchema: DemandForecastingOutputSchema
    },
    async (input: ForecastDemandInput) => forecastDemand(input)
);

const procurementSuggestionTool = ai.defineTool(
    {
        name: 'procurementSuggestion',
        description: 'Recommends optimal raw material orders based on forecasts, inventory, and supplier data.',
        inputSchema: ProcurementSuggestionInputSchema,
        outputSchema: ProcurementSuggestionOutputSchema
    },
    async (input: ProcurementSuggestionInput) => procurementSuggestion(input)
);

const logisticsTool = ai.defineTool(
    {
        name: 'planRoute',
        description: 'Plans an optimal delivery route for a shipment, considering factors like weather and traffic.',
        inputSchema: LogisticsInputSchema,
        outputSchema: LogisticsOutputSchema
    },
    async (input: LogisticsInput) => planRoute(input)
);

const allTools = [anomalyDetectionTool, demandForecastingTool, procurementSuggestionTool, logisticsTool];

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
        prompt: `You are NexusChain AI, the master orchestrator of a team of specialized AI agents. Your primary purpose is to understand a user's supply chain goal, devise a multi-step plan, and execute that plan by calling your agents (available as tools) in a logical sequence. You must think like a project manager, showing your work.

        User Query: "${input.query}"
        
        Your task is to respond to this query by performing the following process:
        1.  **Deconstruct the Goal:** Analyze the user's query to determine the sequence of tasks required. A complex query like "How will a price spike affect my Q3 orders?" requires multiple steps: first confirm the spike (anomaly detection), then predict its impact on demand (forecasting), and finally suggest new orders (procurement).
        2.  **Execute the Plan:** Call the agent tools one by one, in the logical order you decided.
        3.  **Show Your Work:** As you execute the plan, you will generate a final JSON output. The most important part is the \`workflow\` field. For each step in your plan, you must create a workflow object that makes your thinking process transparent.
            *   **action**: Clearly state what the agent did.
            *   **details**: This is the most critical field. You MUST explain:
                *   **WHY** you are taking this step. (e.g., "To confirm the price increase mentioned in the query, I initiated the Anomaly Detection Agent.")
                *   **WHAT** the agent found. (e.g., "The agent confirmed a 15% price increase over the last 7 days, classifying it as market speculation with 95% confidence.")
                *   **HOW** this result informs the next step. (e.g., "This confirmed anomaly and its details are now being passed to the Demand Forecasting Agent to assess the impact on sales.")
        4.  **Synthesize and Recommend:** After all steps are complete, create a high-level \`summary\` of the final outcome and a list of actionable \`recommendations\`.
        
        **Example of a good 'details' field for a forecasting step:**
        "Following the confirmed price anomaly, I initiated the Demand Forecasting agent. **WHY:** To predict how the 15% price increase will affect Q3 sales of Product-X. **WHAT:** The agent analyzed historical sales data from BigQuery and market elasticity models, forecasting a 5% decrease in demand. **HOW:** This forecast of 95,000 units (down from 100,000) is now being passed to the Procurement Agent to adjust raw material orders."
        
        Your final output must be a single JSON object adhering to the schema. The \`workflow\` you build is the story of how the agents collaborated to solve the user's problem. You MUST use the correct icon for each agent: 'AlertTriangle' for detectAnomaly, 'BarChartBig' for forecastDemand, 'ShoppingCart' for procurementSuggestion, and 'Truck' for planRoute.`,
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
