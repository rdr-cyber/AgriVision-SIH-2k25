'use server';
/**
 * @fileOverview This file defines a Genkit flow for QC agents to review AI analysis results of herb samples.
 *
 * - `reviewAiOutputs`: A function that takes herb sample data and returns AI analysis results for review.
 * - `ReviewAiOutputsInput`: The input type for the `reviewAiOutputs` function, including the collection ID.
 * - `ReviewAiOutputsOutput`: The output type, providing species, confidence, and quality score.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const ReviewAiOutputsInputSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the herb sample collection to review.'),
});
export type ReviewAiOutputsInput = z.infer<typeof ReviewAiOutputsInputSchema>;

const ReviewAiOutputsOutputSchema = z.object({
  species: z.string().describe('The identified species of the herb sample.'),
  confidence: z
    .number()
    .describe('The confidence score of the species identification (0-1).'),
  qualityScore: z
    .number()
    .describe('The quality score of the herb sample (0-1).'),
});
export type ReviewAiOutputsOutput = z.infer<typeof ReviewAiOutputsOutputSchema>;

export async function reviewAiOutputs(
  input: ReviewAiOutputsInput
): Promise<ReviewAiOutputsOutput> {
  return reviewAiOutputsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reviewAiOutputsPrompt',
  input: {schema: ReviewAiOutputsInputSchema},
  output: {schema: ReviewAiOutputsOutputSchema},
  prompt: `You are an AI assistant helping QC agents review herb sample analysis.
  Based on the collection ID: {{{collectionId}}}, provide the species, confidence, and quality score.
  Return the information in JSON format.
  `,
});

const reviewAiOutputsFlow = ai.defineFlow(
  {
    name: 'reviewAiOutputsFlow',
    inputSchema: ReviewAiOutputsInputSchema,
    outputSchema: ReviewAiOutputsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
