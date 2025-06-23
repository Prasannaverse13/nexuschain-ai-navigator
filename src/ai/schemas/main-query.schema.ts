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

const ReportChallengeSchema = z.object({
    domain: z.string().describe("The supply chain domain (e.g., 'Planning', 'Sourcing')."),
    challengesIdentified: z.string().describe("A concise description of the key challenge found in this domain."),
    recommendations: z.string().describe("A high-level recommendation to address the challenge.")
});

const ReportSchema = z.object({
    reportTitle: z.string().describe("A descriptive title for the report, e.g., 'Supply Chain Analysis Report: [Product]'. Mention the product from the user query."),
    executiveSummary: z.string().describe("A high-level overview of the most critical findings across all supply chain components, highlighting the major bottlenecks and areas of concern."),
    keyChallengesAndInsights: z.array(ReportChallengeSchema).describe("A table-like structure of key challenges and recommendations for each supply chain domain."),
    suggestedActions: z.array(z.string()).describe("A short list of 3-4 high-impact, actionable next steps."),
});

export const MainQueryOutputSchema = z.object({
  workflow: z.array(WorkflowStepSchema).describe("The sequence of agent steps that were executed to produce the result. This should be generated first."),
  report: ReportSchema.describe("The final, structured report synthesized from all agent findings. This should be generated after the workflow."),
});
export type MainQueryOutput = z.infer<typeof MainQueryOutputSchema>;
