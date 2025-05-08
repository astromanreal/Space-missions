'use server';

/**
 * @fileOverview An AI agent for answering questions about space missions.
 *
 * - spaceMissionQuery - A function that handles querying information about space missions.
 * - SpaceMissionQueryInput - The input type for the spaceMissionQuery function.
 * - SpaceMissionQueryOutput - The return type for the spaceMissionQuery function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getSpaceMissions, SpaceMission} from '@/services/space-missions';

const SpaceMissionQueryInputSchema = z.object({
  query: z.string().describe('The question about space missions.'),
});
export type SpaceMissionQueryInput = z.infer<typeof SpaceMissionQueryInputSchema>;

const SpaceMissionQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the space mission query.'),
});
export type SpaceMissionQueryOutput = z.infer<typeof SpaceMissionQueryOutputSchema>;

export async function spaceMissionQuery(input: SpaceMissionQueryInput): Promise<SpaceMissionQueryOutput> {
  console.log('[spaceMissionQuery] Received input:', input); // Add logging
  try {
      const result = await spaceMissionQueryFlow(input);
      console.log('[spaceMissionQuery] Returning result:', result); // Add logging
      return result;
  } catch (error) {
      console.error('[spaceMissionQuery] Error executing flow:', error); // Add logging
      // Re-throw the error so the frontend can handle it
      throw error;
  }
}

const missionInfoTool = ai.defineTool({
  name: 'getSpaceMissionInfo',
  description: 'Retrieves detailed information about one or more specific space missions when asked. Provide the mission name(s).', // Clarify tool description
  inputSchema: z.object({
    // Allow querying multiple missions if the AI decides to
    missionNames: z.array(z.string()).describe('The exact name(s) of the space mission(s) to retrieve information about.'),
  }),
  // Output an array of missions or a not found message
  outputSchema: z.array(z.object({
    name: z.string(),
    launchYear: z.number(),
    agency: z.string(),
    missionType: z.string(),
    status: z.string(),
    target: z.string(),
    objectives: z.array(z.string()),
    technologies: z.array(z.string()),
    findings: z.array(z.string()),
    image: z.string(),
    // Include optional fields if available
    duration: z.string().optional(),
    externalLinks: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  })),
}, async input => {
  console.log('[getSpaceMissionInfo Tool] Received input:', input); // Add logging
  const allMissions = await getSpaceMissions();
  const foundMissions = input.missionNames.map(requestedName => {
      const mission = allMissions.find(m => m.name.toLowerCase() === requestedName.toLowerCase());
      if (!mission) {
        // Instead of throwing, return null or a specific structure indicating not found,
        // although the prompt should guide the LLM to handle this gracefully.
        // For now, let's log and skip it in the results. The LLM might mention it couldn't find info.
        console.warn(`[getSpaceMissionInfo Tool] Mission "${requestedName}" not found.`);
        return null; // Indicate mission not found
      }
      // Return the full mission object matching the output schema
       return {
         name: mission.name,
         launchYear: mission.launchYear,
         agency: mission.agency,
         missionType: mission.missionType,
         status: mission.status,
         target: mission.target,
         objectives: mission.objectives,
         technologies: mission.technologies,
         findings: mission.findings,
         image: mission.image, // Pass the image identifier
         duration: mission.duration,
         externalLinks: mission.externalLinks,
       };
  }).filter((mission): mission is SpaceMission => mission !== null); // Filter out nulls

  if (foundMissions.length === 0 && input.missionNames.length > 0) {
      // If specifically asked for missions but none were found, the LLM should state that.
      // Returning an empty array signals this.
      console.log('[getSpaceMissionInfo Tool] No missions found for names:', input.missionNames);
  } else {
      console.log('[getSpaceMissionInfo Tool] Found missions:', foundMissions.map(m => m.name));
  }
  return foundMissions; // Return array (might be empty)
});

const prompt = ai.definePrompt({
  name: 'spaceMissionQueryPrompt',
  input: {
    schema: z.object({
      query: z.string().describe('The question about space missions.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The answer to the space mission query. If information for a specific mission was requested but not found using the tool, state that clearly.'), // Update output description
    }),
  },
  tools: [missionInfoTool],
  // Update prompt instructions
  prompt: `You are a helpful AI assistant providing concise and accurate information about space missions.
- Use the 'getSpaceMissionInfo' tool ONLY when the user asks for details about specific named mission(s). Provide the exact mission name(s) to the tool.
- If the tool returns information, use it to answer the question. Summarize key details if multiple missions are returned.
- If the tool returns an empty result for a specific mission request, clearly state that you couldn't find information for that mission.
- For general questions about space exploration, mission types, or technology that don't name a specific mission, answer based on your general knowledge without using the tool.
- Keep answers focused and relevant to the question.

Question: {{{query}}}`,
});

const spaceMissionQueryFlow = ai.defineFlow<
  typeof SpaceMissionQueryInputSchema,
  typeof SpaceMissionQueryOutputSchema
>({
  name: 'spaceMissionQueryFlow',
  inputSchema: SpaceMissionQueryInputSchema,
  outputSchema: SpaceMissionQueryOutputSchema,
}, async input => {
   console.log('[spaceMissionQueryFlow] Starting flow with input:', input); // Add logging
  try {
    const {output} = await prompt(input);
    if (!output) {
       console.error('[spaceMissionQueryFlow] Prompt returned undefined output.');
       throw new Error('AI failed to generate a response.');
    }
    console.log('[spaceMissionQueryFlow] Prompt returned output:', output); // Add logging
    return output;
  } catch (error) {
      console.error('[spaceMissionQueryFlow] Error during prompt execution:', error); // Log specific error
      // Re-throw the error to be caught by the calling function
      throw error;
  }

});
