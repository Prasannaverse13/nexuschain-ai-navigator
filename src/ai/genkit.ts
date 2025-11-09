import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {vertexAI} from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [
    googleAI({apiVersion: 'v1beta'}),
    // The Vertex AI plugin needs a project ID, especially in serverless environments like Vercel.
    // We explicitly provide it from an environment variable to prevent auto-detection issues.
    vertexAI({location: 'us-central1', project: process.env.GCLOUD_PROJECT}),
  ],
  // By explicitly setting the default model to a googleAI model,
  // we ensure the vertexAI plugin is not used for default generation calls.
  model: 'googleai/gemini-2.0-flash',
});
