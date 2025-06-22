'use server';
/**
 * @fileOverview The Manager Agent: A central orchestrator for NexusChain AI.
 *
 * This flow takes a high-level user query, breaks it down, delegates tasks
 * to specialized sub-agents (available as tools), and synthesizes their
 * findings into a comprehensive result for the user.
 *
 * - mainQuery - The primary function that processes a user's goal.
 * - MainQueryInput - The input type for the mainQuery function.
 * - MainQueryOutput - The return type for the mainQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

import { planningAgent } from '../agents/planning-agent';
import { sourcingAgent } from '../agents/sourcing-agent';
import { deliveryAgent } from '../agents/delivery-agent';

import { PlanningAgentInputSchema, PlanningAgentOutputSchema } from '../schemas/planning-agent.schema';
import { SourcingAgentInputSchema, SourcingAgentOutputSchema } from '../schemas/sourcing-agent.schema';
import { DeliveryAgentInputSchema, DeliveryAgentOutputSchema } from '../schemas/delivery-agent.schema';

// Schemas for the Main Orchestrator Flow
const MainQueryInputSchema = z.object({
  query: z.string().describe('A high-level user query or goal for the supply chain.'),
});
export type MainQueryInput = z.infer<typeof MainQueryInputSchema>;

const WorkflowStepSchema = z.object({
  agent: z.string().describe('The name of the agent that performed the action (e.g., "Manager Agent", "Planning Agent").'),
  icon: z.enum(['BrainCircuit', 'ClipboardList', 'Combine', 'Truck', 'Factory', 'Archive', 'ShieldAlert']).describe("The pre-defined Lucide icon name representing the agent."),
  thought: z.string().describe("A summary of the agent's thinking process, explaining WHY it took this action."),
  action: z.string().describe("A short, past-tense summary of the agent's action and its primary result."),
  details: z.object({
      searchQueriesUsed: z.array(z.string()).optional().describe("A list of search queries the agent used to find information on the open internet."),
      keyInformationExtracted: z.array(z.string()).optional().describe("A list of key facts or data points the agent extracted from its sources."),
  }).describe("The detailed evidence and findings from the agent's work."),
});

const RecommendationSchema = z.object({
    text: z.string().describe("The actionable recommendation text."),
    action: z.string().optional().describe("A suggested button label for a follow-up action, e.g., 'Generate Brief', 'Explore Alternatives'.")
});

const MainQueryOutputSchema = z.object({
  summary: z.string().describe("A concise, high-level summary that directly answers the user's query, synthesized from all agent findings."),
  recommendations: z.array(RecommendationSchema).describe("A list of key, actionable recommendations derived from the multi-agent analysis."),
  workflow: z.array(WorkflowStepSchema).describe("The sequence of agent steps that were executed to produce the result. The sequence should be logical."),
});
export type MainQueryOutput = z.infer<typeof MainQueryOutputSchema>;


// Define Sub-Agent Tools
const planningTool = ai.defineTool(
    {
        name: 'planningAgent',
        description: 'Analyzes demand forecasting, production scheduling, and market trends for a product or topic. Use this for questions about planning.',
        inputSchema: PlanningAgentInputSchema,
        outputSchema: PlanningAgentOutputSchema
    },
    async (input) => planningAgent(input)
);

const sourcingTool = ai.defineTool(
    {
        name: 'sourcingAgent',
        description: 'Researches suppliers, raw material prices, and sourcing strategies for a given material or component.',
        inputSchema: SourcingAgentInputSchema,
        outputSchema: SourcingAgentOutputSchema
    },
    async (input) => sourcingAgent(input)
);

const deliveryTool = ai.defineTool(
    {
        name: 'deliveryAgent',
        description: 'Investigates logistics, transportation routes, and delivery challenges for a product type or region.',
        inputSchema: DeliveryAgentInputSchema,
        outputSchema: DeliveryAgentOutputSchema
    },
    async (input) => deliveryAgent(input)
);

const allTools = [planningTool, sourcingTool, deliveryTool];

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
        prompt: `You are the Manager Agent for NexusChain AI, a sophisticated multi-agent supply chain analysis system. Your primary purpose is to understand a user's high-level goal, break it down into specialized tasks, delegate those tasks to your sub-agents (available as tools), and then synthesize their findings into a coherent, actionable report for the user.

        User Query: "${input.query}"
        
        Your task is to respond to this query by performing the following process:
        1.  **Deconstruct the Goal:** Analyze the user's query to determine which aspects of the supply chain (Planning, Sourcing, Delivery, etc.) are relevant.
        2.  **Formulate a Plan & Delegate:** Create a step-by-step plan. For each step, determine the appropriate sub-agent to call. Before calling, articulate your **thought** process for why you are choosing that agent.
        3.  **Execute & Show Your Work:** Call the sub-agent tools one by one. As you get results, you will generate a final JSON output. The most important part is the \`workflow\` field. For each step in your plan (including your own analysis), you must create a workflow object.
            *   **agent**: Your name is "Manager Agent". For sub-agents, use their proper names: "Planning Agent", "Sourcing Agent", "Delivery Agent".
            *   **icon**: Use 'BrainCircuit' for yourself. For sub-agents, use 'ClipboardList' for the Planning Agent, 'Combine' for the Sourcing Agent, and 'Truck' for the Delivery Agent.
            *   **thought**: THIS IS CRITICAL. Explain **WHY** you are taking this step. (e.g., "The user is asking about sourcing strategies, so I need to engage the Sourcing Agent to investigate material suppliers.")
            *   **action**: Clearly state what the agent did. (e.g., "Delegated the task of finding lithium battery suppliers to the Sourcing Agent.")
            *   **details**: For sub-agents, populate this with the information they return, including their search queries and findings. For your own steps, you can provide a summary of your reasoning.
        4.  **Synthesize and Recommend:** After all sub-agents have run, create a high-level \`summary\` of the final outcome that directly answers the user's query and a list of actionable \`recommendations\`.
        
        Your final output must be a single JSON object adhering to the schema. The \`workflow\` you build is the story of how you and your agents collaborated to solve the user's problem.`,
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
