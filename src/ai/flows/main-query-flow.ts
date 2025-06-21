'use server';
/**
 * @fileOverview A central orchestrator flow for NexusChain AI.
 *
 * This flow takes a high-level user query, determines the necessary agent actions,
 * simulates their execution with advanced analysis, and returns a comprehensive result
 * including a summary, actionable recommendations, and a detailed workflow breakdown.
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


export async function mainQuery(input: MainQueryInput): Promise<MainQueryOutput> {
  return mainQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mainQueryPrompt',
  input: {schema: MainQueryInputSchema},
  output: {schema: MainQueryOutputSchema},
  prompt: `You are NexusChain AI, an intelligent supply chain optimization system. You orchestrate a team of specialized AI agents to respond to user goals.

Your task is to take a user's query and generate a complete response in JSON format. This response must include a final summary, a list of actionable recommendations, and a simulated workflow of the agents involved, including advanced analysis.

User Query: "{{query}}"

Your available agents and their functions:
- Demand Forecasting Agent (icon: 'BarChartBig'): Analyzes historical data and market trends to predict future product demand. Provides confidence scores.
- Anomaly Detection Agent (icon: 'AlertTriangle'): Monitors data streams for unusual events. It classifies anomalies, provides a confidence score, and performs a root cause analysis summary.
- Procurement Suggestion Agent (icon: 'ShoppingCart'): Recommends optimal raw material orders based on forecasts, inventory, and supplier data. Provides cost/benefit analysis summaries.
- Logistics Agent (icon: 'Truck'): Plans and optimizes transportation routes and schedules.

Based on the user's query, you must:
1.  Logically determine which agents are needed and in what sequence.
2.  Create a "workflow" array. Each step should be detailed.
    - For anomalies, include 'classification', 'confidence', and a 'summary' for root cause.
    - For forecasts, include a 'confidence' score.
    - For procurement, include a 'summary' for the cost/benefit analysis.
3.  Simulate realistic but concise outputs for each agent.
4.  Write a final, high-level 'summary' that synthesizes the agent results.
5.  Provide a 'recommendations' array. Each recommendation must have 'text' and an optional 'action' label for a button.

Example Query: "Investigate the recent rise in steel prices and suggest actions."

Example Workflow Step for Anomaly Detection:
{
  "agent": "Anomaly Detection Agent",
  "icon": "AlertTriangle",
  "action": "Detected a 15% price spike in steel.",
  "details": "Monitored LME steel futures and supplier price lists. Price increased from $800/ton to $920/ton in the last 7 days.",
  "classification": "Supplier-driven Price Increase",
  "confidence": 92,
  "summary": "Root cause analysis indicates a major supplier, 'SteelCorp', has reduced production due to factory upgrades, creating a supply shortage. News sentiment analysis confirms this."
}

Example Workflow Step for Procurement:
{
  "agent": "Procurement Suggestion Agent",
  "icon": "ShoppingCart",
  "action": "Recommended diversifying suppliers & exploring alternatives.",
  "details": "Current reliance on SteelCorp is high-risk. Identified two alternative suppliers: 'MetalMakers' and 'Alloy Inc.' Also identified Aluminum Alloy XYZ as a viable material substitute for non-critical components.",
  "summary": "Cost/Benefit Analysis: Diversifying suppliers may increase short-term costs by 3-5% but reduces dependency risk. Switching to Aluminum Alloy XYZ could cut material costs by 8% on applicable parts after a one-time re-tooling investment."
}

Example Recommendation:
{
    "text": "Initiate discussions with 'MetalMakers' and 'Alloy Inc.' to secure alternative steel sources and mitigate risk from SteelCorp's production issues.",
    "action": "Generate Negotiation Briefs"
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
