import {z} from 'genkit';

// Schemas for the Main Orchestrator Flow
export const MainQueryInputSchema = z.object({
  query: z.string().describe('A high-level user query or goal for the supply chain.'),
});
export type MainQueryInput = z.infer<typeof MainQueryInputSchema>;

const WorkflowStepSchema = z.object({
  agent: z.string().describe('The name of the agent that performed the action (e.g., "Manager Agent", "Planning Agent").'),
  icon: z.enum(['BrainCircuit', 'ClipboardList', 'Combine', 'Truck', 'Factory', 'Archive', 'Undo', 'ShieldAlert']).describe("The pre-defined Lucide icon name representing the agent."),
  thought: z.string().describe("A summary of the agent's thinking process, explaining WHY it took this action."),
  action: z.string().describe("A short, past-tense summary of the agent's action and its primary result."),
  details: z.object({
      searchQueriesUsed: z.array(z.string()).optional().describe("A list of search queries the agent used to find information on the open internet."),
      keyInformationExtracted: z.array(z.string()).optional().describe("A list of key facts or data points the agent extracted from its sources."),
  }).describe("The detailed evidence and findings from the agent's work."),
});

const RecommendationSchema = z.object({
    text: z.string().describe("The actionable recommendation text."),
    action: z.string().optional().describe("A suggested button label for a follow-up action, e.g., 'Generate Demand Forecast', 'Find Suppliers'.")
});

export const MainQueryOutputSchema = z.object({
  summary: z.string().describe("A concise, high-level summary that directly answers the user's query, synthesized from all agent findings."),
  recommendations: z.array(RecommendationSchema).describe("A list of key, actionable recommendations derived from the multi-agent analysis."),
  workflow: z.array(WorkflowStepSchema).describe("The sequence of agent steps that were executed to produce the result. The sequence should be logical."),
});
export type MainQueryOutput = z.infer<typeof MainQueryOutputSchema>;
