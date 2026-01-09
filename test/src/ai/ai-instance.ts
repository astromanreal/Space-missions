import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Retrieve API key from environment variables
const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!googleApiKey || googleApiKey === 'YOUR_API_KEY_HERE') {
  console.warn(
    '\n********************************************************************\n' +
    'WARNING: GOOGLE_GENAI_API_KEY is not set or is still the placeholder.\n' +
    'The AI features will not work.\n' +
    'Please get an API key from Google AI Studio (https://aistudio.google.com/app/apikey)\n' +
    'and add it to your .env file.\n' +
    '********************************************************************\n'
  );
  // Optionally, you could throw an error here to prevent the app from starting fully
  // throw new Error("GOOGLE_GENAI_API_KEY is not configured. AI features are disabled.");
}


export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      // Use the retrieved API key
      apiKey: googleApiKey,
    }),
  ],
  // Default model for generation if not specified in the call
  model: 'googleai/gemini-1.5-flash', // Use a known good model like 1.5 Flash
  logLevel: 'debug', // Enable debug logging for Genkit
});
