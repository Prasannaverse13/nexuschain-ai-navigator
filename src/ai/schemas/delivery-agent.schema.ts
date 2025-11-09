import {z} from 'genkit';

export const DeliveryAgentInputSchema = z.object({
  productType: z.string().describe("The type of product being delivered, e.g., 'perishable goods'."),
  region: z.string().describe("The geographical region for the delivery analysis, e.g., 'Southeast Asia'."),
});
export type DeliveryAgentInput = z.infer<typeof DeliveryAgentInputSchema>;

export const DeliveryAgentOutputSchema = z.object({
    searchQueriesUsed: z.array(z.string()).describe("A list of search queries the agent used to find information."),
    keyInformationExtracted: z.array(z.string()).describe("Key facts and data points extracted about logistics in the region."),
});
export type DeliveryAgentOutput = z.infer<typeof DeliveryAgentOutputSchema>;
