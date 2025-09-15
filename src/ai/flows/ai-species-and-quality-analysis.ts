'use server';
/**
 * @fileOverview An AI agent that analyzes herb samples for species identification and quality assessment.
 *
 * - analyzeHerbSample - A function that handles the herb sample analysis process.
 * - AnalyzeHerbSampleInput - The input type for the analyzeHerbSample function.
 * - AnalyzeHerbSampleOutput - The return type for the analyzeHerbSample function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeHerbSampleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an herb sample, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeHerbSampleInput = z.infer<typeof AnalyzeHerbSampleInputSchema>;

const AnalyzeHerbSampleOutputSchema = z.object({
  species: z.string().describe('The identified species of the herb sample.'),
  confidence: z
    .number()
    .describe('The confidence score of the species identification (0-1).'),
  qualityScore: z.number().describe('The quality score of the herb sample (0-100).'),
});
export type AnalyzeHerbSampleOutput = z.infer<typeof AnalyzeHerbSampleOutputSchema>;

export async function analyzeHerbSample(
  input: AnalyzeHerbSampleInput
): Promise<AnalyzeHerbSampleOutput> {
  return analyzeHerbSampleFlow(input);
}

const analyzeHerbSamplePrompt = ai.definePrompt({
  name: 'analyzeHerbSamplePrompt',
  input: {schema: AnalyzeHerbSampleInputSchema},
  output: {schema: AnalyzeHerbSampleOutputSchema},
  prompt: `You are an expert in herb identification and quality assessment.

  Analyze the provided image of the herb sample and provide the following information:

  - Species: Identify the species of the herb.
  - Confidence: Provide a confidence score (0-1) for the species identification.
  - Quality Score: Assess the quality of the herb sample on a scale of 0-100, considering factors like appearance, color, and any visible defects.

  Here is the image of the herb sample:
  {{media url=photoDataUri}}
  `,
});

const analyzeHerbSampleFlow = ai.defineFlow(
  {
    name: 'analyzeHerbSampleFlow',
    inputSchema: AnalyzeHerbSampleInputSchema,
    outputSchema: AnalyzeHerbSampleOutputSchema,
  },
  async input => {
    const {output} = await analyzeHerbSamplePrompt(input);
    return output!;
  }
);
