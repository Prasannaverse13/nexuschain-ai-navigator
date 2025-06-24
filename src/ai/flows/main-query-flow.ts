'use server';
/**
 * @fileOverview The Manager Agent: A central orchestrator for NexusChain AI.
 *
 * This flow takes a high-level user query, breaks it down, delegates tasks
 * to specialized sub-agents (available as tools), and synthesizes their
 * findings into a comprehensive, structured report for the user.
 *
 * This is a core implementation of the Agent Development Kit (ADK) pattern,
 * where this "manager" agent uses other specialized agents as tools.
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
import { manufacturingAgent } from '../agents/manufacturing-agent';
import { inventoryAgent } from '../agents/inventory-agent';
import { returnsAgent } from '../agents/returns-agent';
import { anomalyDetectionAgent } from '../agents/anomaly-detection-agent';

import { PlanningAgentInputSchema, PlanningAgentOutputSchema } from '../schemas/planning-agent.schema';
import { SourcingAgentInputSchema, SourcingAgentOutputSchema } from '../schemas/sourcing-agent.schema';
import { DeliveryAgentInputSchema, DeliveryAgentOutputSchema } from '../schemas/delivery-agent.schema';
import { ManufacturingAgentInputSchema, ManufacturingAgentOutputSchema } from '../schemas/manufacturing-agent.schema';
import { InventoryAgentInputSchema, InventoryAgentOutputSchema } from '../schemas/inventory-agent.schema';
import { ReturnsAgentInputSchema, ReturnsAgentOutputSchema } from '../schemas/returns-agent.schema';
import { AnomalyDetectionAgentInputSchema, AnomalyDetectionAgentOutputSchema } from '../schemas/anomaly-detection-agent.schema';
import { MainQueryInputSchema, MainQueryOutputSchema } from '../schemas/main-query.schema';

export type { MainQueryInput, MainQueryOutput } from '../schemas/main-query.schema';


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

const manufacturingTool = ai.defineTool(
    {
        name: 'manufacturingAgent',
        description: 'Analyzes manufacturing processes, quality control, and production best practices for a product type.',
        inputSchema: ManufacturingAgentInputSchema,
        outputSchema: ManufacturingAgentOutputSchema,
    },
    async (input) => manufacturingAgent(input)
);

const inventoryTool = ai.defineTool(
    {
        name: 'inventoryAgent',
        description: 'Researches optimal inventory levels, management strategies (like JIT), and turnover rates for a product.',
        inputSchema: InventoryAgentInputSchema,
        outputSchema: InventoryAgentOutputSchema,
    },
    async (input) => inventoryAgent(input)
);

const returnsTool = ai.defineTool(
    {
        name: 'returnsAgent',
        description: 'Investigates reverse logistics, common return policies, and customer satisfaction strategies related to product returns.',
        inputSchema: ReturnsAgentInputSchema,
        outputSchema: ReturnsAgentOutputSchema,
    },
    async (input) => returnsAgent(input)
);

const anomalyDetectionTool = ai.defineTool(
    {
        name: 'anomalyDetectionAgent',
        description: 'Monitors a stream of data for anomalies, such as price spikes or delays, and provides an analysis.',
        inputSchema: AnomalyDetectionAgentInputSchema,
        outputSchema: AnomalyDetectionAgentOutputSchema,
    },
    async (input) => anomalyDetectionAgent(input)
);


const allTools = [planningTool, sourcingTool, deliveryTool, manufacturingTool, inventoryTool, returnsTool, anomalyDetectionTool];

// Main Orchestrator Flow
export async function mainQuery(input: z.infer<typeof MainQueryInputSchema>): Promise<z.infer<typeof MainQueryOutputSchema>> {
  return mainQueryFlow(input);
}

const managerAgentPrompt = ai.definePrompt({
    name: 'managerAgentPrompt',
    input: { schema: MainQueryInputSchema },
    output: { schema: MainQueryOutputSchema },
    tools: allTools,
    prompt: `You are the Manager Agent for NexusChain AI, a sophisticated multi-agent supply chain analysis system. Your primary purpose is to provide a HOLISTIC and COMPREHENSIVE analysis of a user's supply chain query by orchestrating your team of specialized sub-agents.

    User Query: "{{{query}}}"
    
    Your task is to respond to this query by performing a two-stage process:

    **Stage 1: Agent Workflow Execution**
    1.  **Formulate a Holistic Plan:** Based on the user's query, create a step-by-step plan that touches upon MULTIPLE relevant supply chain components. A query about one area (e.g., Sourcing) ALWAYS has implications for other areas (e.g., Planning, Delivery).
    2.  **Delegate to Multiple Sub-Agents:** Execute your plan by calling the appropriate sub-agent tools in a logical sequence.
    3.  **Show Your Work:** For each step in your plan, you must create a workflow object. This is the story of how you and your team collaborated.
        *   **agent**: Your name is "Manager Agent". Use the proper names for your sub-agents.
        *   **icon**: Use 'BrainCircuit' for yourself. Use 'ClipboardList' for Planning, 'Combine' for Sourcing, 'Factory' for Manufacturing, 'Archive' for Inventory, 'Truck' for Delivery, 'Undo' for Returns, and 'ShieldAlert' for Anomaly Detection.
        *   **thought**: THIS IS CRITICAL. Explain **WHY** you are taking this step as part of your holistic plan.
        *   **action**: Clearly state what the agent did.
        *   **details**: For sub-agents, populate this with the information they return. For your own steps, summarize your reasoning.
    
    **Stage 2: Synthesize a Formal Report**
    After all sub-agents have run and the workflow is complete, you will synthesize all the gathered information into a single, structured report object.
    1.  **Report Title**: Create a descriptive title including the product from the user's query.
    2.  **Executive Summary**: Write a high-level overview of the most critical findings.
    3.  **Key Challenges and Insights**: For each major supply chain domain (Planning, Sourcing, Manufacturing, etc.), create an entry detailing the 'challengesIdentified' and a 'recommendations' to address it.
    4.  **Suggested Actions**: Create a short, high-impact list of 3-4 actionable next steps.

    Your final output must be a single JSON object containing both the 'workflow' array and the 'report' object.`,
});


const mainQueryFlow = ai.defineFlow(
  {
    name: 'mainQueryFlow',
    inputSchema: MainQueryInputSchema,
    outputSchema: MainQueryOutputSchema,
  },
  async (input) => {
    const llmResponse = await managerAgentPrompt(input);

    const output = llmResponse.output;
    if (!output) {
      throw new Error("Failed to get a structured response from the AI model.");
    }
    return output;
  }
);
