import {z} from 'genkit';

export const ReturnsAgentInputSchema = z.object({
  productType: z.string().describe("The type of product to analyze for returns processes, e.g., 'apparel' or 'consumer electronics'."),
});
export type ReturnsAgentInput = z.infer<typeof ReturnsAgentInputSchema>;

export const ReturnsAgentOutputSchema = z.object({
    searchQueriesUsed: z.array(z.string()).describe("A list of search queries the agent used to find information."),
    keyInformationExtracted: z.array(z.string()).describe("Key facts and data points extracted about returns and reverse logistics."),
});
export type ReturnsAgentOutput = z.infer<typeof ReturnsAgentOutputSchema>;
