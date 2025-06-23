import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {vertexAI} from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [
    googleAI({apiVersion: 'v1beta'}),
    vertexAI({location: 'us-central1'}), // The Vertex AI plugin is now present and appears configured.
  ],
  // By explicitly setting the default model to a googleAI model,
  // we ensure the vertexAI plugin is not used for default generation calls.
  model: 'googleai/gemini-2.0-flash',
});
