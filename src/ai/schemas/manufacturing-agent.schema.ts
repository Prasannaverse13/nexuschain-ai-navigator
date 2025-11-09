import {z} from 'genkit';

export const ManufacturingAgentInputSchema = z.object({
  productType: z.string().describe("The type of product to analyze for manufacturing processes, e.g., 'electric vehicles'."),
});
export type ManufacturingAgentInput = z.infer<typeof ManufacturingAgentInputSchema>;

export const ManufacturingAgentOutputSchema = z.object({
    searchQueriesUsed: z.array(z.string()).describe("A list of search queries the agent used to find information."),
    keyInformationExtracted: z.array(z.string()).describe("Key facts and data points extracted about manufacturing for this product type."),
});
export type ManufacturingAgentOutput = z.infer<typeof ManufacturingAgentOutputSchema>;
