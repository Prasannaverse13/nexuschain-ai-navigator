import {z} from 'genkit';

export const AnomalyDetectionInputSchema = z.object({
  dataStreamDescription: z
    .string()
    .describe('Description of the data stream being monitored.'),
  recentDataSample: z
    .string()
    .describe('A recent sample of data from the stream.'),
});

export const AnomalyDetectionOutputSchema = z.object({
  isAnomaly: z.boolean().describe('Whether an anomaly is detected.'),
  anomalyDescription: z
    .string()
    .describe('A description of the detected anomaly, if any.'),
  suggestedActions: z.string().describe('Suggested actions to mitigate the anomaly'),
  confidence: z.number().optional().describe("A confidence score (0-100) for the anomaly detection."),
  classification: z.string().optional().describe("The type of anomaly (e.g., 'Supplier-driven price increase', 'Market speculation')."),
  rootCauseSummary: z.string().optional().describe("A brief summary of the potential root cause."),
});
