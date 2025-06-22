import {z} from 'genkit';

export const SourcingAgentInputSchema = z.object({
  materialOrComponent: z.string().describe("The raw material or component to research for sourcing strategies, e.g., 'lithium batteries' or 'aerospace-grade aluminum'."),
});
export type SourcingAgentInput = z.infer<typeof SourcingAgentInputSchema>;

export const SourcingAgentOutputSchema = z.object({
    searchQueriesUsed: z.array(z.string()).describe("A list of search queries the agent used to find information."),
    keyInformationExtracted: z.array(z.string()).describe("Key facts and data points extracted from search results about suppliers and pricing."),
});
export type SourcingAgentOutput = z.infer<typeof SourcingAgentOutputSchema>;
