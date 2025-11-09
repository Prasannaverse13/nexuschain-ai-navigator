import {z} from 'genkit';

export const PlanningAgentInputSchema = z.object({
  productTopic: z.string().describe("The product or topic to analyze for planning and demand purposes, e.g., 'electric scooters' or 'perishable goods'."),
});
export type PlanningAgentInput = z.infer<typeof PlanningAgentInputSchema>;

export const PlanningAgentOutputSchema = z.object({
    searchQueriesUsed: z.array(z.string()).describe("A list of search queries the agent used to find information."),
    keyInformationExtracted: z.array(z.string()).describe("Key facts and data points extracted from search results."),
});
export type PlanningAgentOutput = z.infer<typeof PlanningAgentOutputSchema>;
