
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
  description: 'Retrieves detailed information about one or more specific space missions when asked. Provide the mission name(s).',
  inputSchema: z.object({
    missionNames: z.array(z.string()).describe('The exact name(s) of the space mission(s) to retrieve information about.'),
  }),
  outputSchema: z.array(z.object({
    missionName: z.string(),
    launch: z.object({ launchDate: z.string(), launchVehicle: z.string() }),
    agency: z.object({ name: z.string(), country: z.string(), organizationType: z.string() }),
    missionType: z.string(),
    status: z.string(),
    target: z.string(),
    objectives: z.array(z.string()),
    technologies: z.array(z.string()),
    findings: z.array(z.string()),
    image: z.string(),
    duration: z.string().optional(),
    external_links: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  })),
}, async input => {
  console.log('[getSpaceMissionInfo Tool] Received input:', input);
  const allMissions = await getSpaceMissions();
  const foundMissions = input.missionNames.map(requestedName => {
      const mission = allMissions.find(m => m.missionName.toLowerCase() === requestedName.toLowerCase());
      if (!mission) {
        console.warn(`[getSpaceMissionInfo Tool] Mission "${requestedName}" not found.`);
        return null;
      }
      return {
         missionName: mission.missionName,
         launch: {
            launchDate: mission.launch.launchDate,
            launchVehicle: mission.launch.launchVehicle,
         },
         agency: mission.agency,
         missionType: mission.missionType,
         status: mission.status,
         target: mission.target,
         objectives: mission.objectives,
         technologies: mission.technologies,
         findings: mission.findings,
         image: mission.image,
         duration: mission.duration,
         external_links: mission.external_links,
       };
  }).filter((mission): mission is any => mission !== null);

  if (foundMissions.length === 0 && input.missionNames.length > 0) {
      console.log('[getSpaceMissionInfo Tool] No missions found for names:', input.missionNames);
  } else {
      console.log('[getSpaceMissionInfo Tool] Found missions:', foundMissions.map(m => m.missionName));
  }
  return foundMissions;
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
      answer: z.string().describe('The answer to the space mission query. If information for a specific mission was requested but not found using the tool, state that clearly.'),
    }),
  },
  tools: [missionInfoTool],
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
   console.log('[spaceMissionQueryFlow] Starting flow with input:', input);
  try {
    const {output} = await prompt(input);
    if (!output) {
       console.error('[spaceMissionQueryFlow] Prompt returned undefined output.');
       throw new Error('AI failed to generate a response.');
    }
    console.log('[spaceMissionQueryFlow] Prompt returned output:', output);
    return output;
  } catch (error) {
      console.error('[spaceMissionQueryFlow] Error during prompt execution:', error);
      throw error;
  }

});
