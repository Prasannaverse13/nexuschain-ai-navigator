import {z} from 'genkit';

export const AnomalyDetectionAgentInputSchema = z.object({
  dataStreamDescription: z.string().describe("The description of the data stream to monitor, e.g., 'Global steel prices'."),
});
export type AnomalyDetectionAgentInput = z.infer<typeof AnomalyDetectionAgentInputSchema>;

export const AnomalyDetectionAgentOutputSchema = z.object({
    searchQueriesUsed: z.array(z.string()).describe("A list of search queries the agent used to find information."),
    keyInformationExtracted: z.array(z.string()).describe("Key facts and data points extracted about potential anomalies."),
});
export type AnomalyDetectionAgentOutput = z.infer<typeof AnomalyDetectionAgentOutputSchema>;
