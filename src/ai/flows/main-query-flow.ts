'use server';
/**
 * @fileOverview A central orchestrator flow for NexusChain AI.
 *
 * This flow takes a high-level user query, determines the necessary agent actions,
 * simulates their execution, and returns a comprehensive result including a summary,
 * recommendations, and a detailed workflow breakdown.
 *
 * - mainQuery - The primary function that processes a user's goal.
 * - MainQueryInput - The input type for the mainQuery function.
 * - MainQueryOutput - The return type for the mainQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MainQueryInputSchema = z.object({
  query: z.string().describe('A high-level user query or goal for the supply chain.'),
});
export type MainQueryInput = z.infer<typeof MainQueryInputSchema>;

const WorkflowStepSchema = z.object({
  agent: z.string().describe('The name of the agent that performed the action (e.g., "Demand Forecasting Agent").'),
  icon: z.enum(['BarChartBig', 'AlertTriangle', 'ShoppingCart', 'Truck']).describe("The pre-defined Lucide icon name representing the agent."),
  action: z.string().describe("A short, past-tense summary of the agent's action and its primary result."),
  details: z.string().describe("A more detailed explanation of the agent's findings, the data it used, or the reasoning behind its action."),
});

const MainQueryOutputSchema = z.object({
  summary: z.string().describe("A concise, high-level summary paragraph that directly answers the user's query."),
  recommendations: z.array(z.string()).describe("A list of 2-4 key, actionable recommendations or next steps."),
  workflow: z.array(WorkflowStepSchema).describe("The sequence of agent steps that were executed to produce the result. The sequence should be logical."),
});
export type MainQueryOutput = z.infer<typeof MainQueryOutputSchema>;


export async function mainQuery(input: MainQueryInput): Promise<MainQueryOutput> {
  return mainQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mainQueryPrompt',
  input: {schema: MainQueryInputSchema},
  output: {schema: MainQueryOutputSchema},
  prompt: `You are NexusChain AI, an intelligent supply chain optimization system. You orchestrate a team of specialized AI agents to respond to user goals.

Your task is to take a user's query and generate a complete response in JSON format. This response must include a final summary, a list of recommendations, and a simulated workflow of the agents involved.

User Query: "{{query}}"

Your available agents and their functions are:
- Demand Forecasting Agent (icon: 'BarChartBig'): Analyzes historical data and market trends to predict future product demand.
- Anomaly Detection Agent (icon: 'AlertTriangle'): Monitors data streams for unusual events like price spikes, shipping delays, or quality issues.
- Procurement Suggestion Agent (icon: 'ShoppingCart'): Recommends optimal raw material orders based on demand forecasts, inventory levels, and supplier data.
- Logistics Agent (icon: 'Truck'): Plans and optimizes transportation routes and schedules.

Based on the user's query, you must:
1.  Logically determine which agents are needed and in what sequence. For example, demand forecasting must happen before procurement suggestions can be made based on that forecast.
2.  Create a "workflow" array, with one object for each agent's action. Each object must contain the agent's name, its assigned icon, a short 'action' summary, and more extensive 'details'.
3.  Simulate realistic but concise outputs for each agent. For example, a forecast should include a number of units, and a procurement suggestion should mention materials and quantities.
4.  Write a final, high-level 'summary' that synthesizes the agent results and directly answers the user's initial query.
5.  Provide a 'recommendations' array with clear, actionable next steps for the user.

Example Query: "Forecast demand for Product Alpha for the next 6 months and suggest procurement actions."

Example Workflow Step for Forecasting:
{
  "agent": "Demand Forecasting Agent",
  "icon": "BarChartBig",
  "action": "Forecasted 100,000 units for Product Alpha over the next 6 months.",
  "details": "Analysis based on sales data from Q1 2023 to Q2 2025 from the BigQuery 'sales_history' table, factoring in a 5% projected market growth."
}

Example Workflow Step for Procurement:
{
  "agent": "Procurement Suggestion Agent",
  "icon": "ShoppingCart",
  "action": "Recommended ordering 25,000 units of raw material X.",
  "details": "Current inventory of material X is 5,000 units, below the 10,000 unit safety threshold. The 100,000 unit forecast requires an additional 20,000 units. Suggesting an order of 25,000 units to replenish stock and meet new demand. Supplier Y offers the best price at $15/unit."
}

Now, for the user query "{{query}}", generate the full JSON output.
`,
});

const mainQueryFlow = ai.defineFlow(
  {
    name: 'mainQueryFlow',
    inputSchema: MainQueryInputSchema,
    outputSchema: MainQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI model.");
    }
    return output;
  }
);
