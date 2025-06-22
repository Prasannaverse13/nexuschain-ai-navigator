import {z} from 'genkit';

export const InventoryAgentInputSchema = z.object({
  productType: z.string().describe("The type of product to analyze for inventory strategies, e.g., 'consumer electronics'."),
});
export type InventoryAgentInput = z.infer<typeof InventoryAgentInputSchema>;

export const InventoryAgentOutputSchema = z.object({
    searchQueriesUsed: z.array(z.string()).describe("A list of search queries the agent used to find information."),
    keyInformationExtracted: z.array(z.string()).describe("Key facts and data points extracted about inventory management for this product type."),
});
export type InventoryAgentOutput = z.infer<typeof InventoryAgentOutputSchema>;
