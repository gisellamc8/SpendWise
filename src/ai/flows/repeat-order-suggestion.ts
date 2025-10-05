'use server';

/**
 * @fileOverview Suggests repeating a user's previous order based on their purchase history.
 *
 * - suggestRepeatOrder - A function that suggests repeating the previous order.
 * - SuggestRepeatOrderInput - The input type for the suggestRepeatOrder function.
 * - SuggestRepeatOrderOutput - The return type for the suggestRepeatOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRepeatOrderInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  hasPreviousOrder: z.boolean().describe('Whether the user has a previous order.'),
  previousOrderItems: z.array(z.string()).optional().describe('List of item names from the previous order.'),
});
export type SuggestRepeatOrderInput = z.infer<typeof SuggestRepeatOrderInputSchema>;

const SuggestRepeatOrderOutputSchema = z.object({
  shouldSuggestRepeatOrder: z
    .boolean()
    .describe('Whether to suggest repeating the previous order.'),
  suggestionReason: z
    .string()
    .optional()
    .describe('The reason for suggesting or not suggesting the repeat order.'),
});
export type SuggestRepeatOrderOutput = z.infer<typeof SuggestRepeatOrderOutputSchema>;

export async function suggestRepeatOrder(input: SuggestRepeatOrderInput): Promise<SuggestRepeatOrderOutput> {
  return suggestRepeatOrderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRepeatOrderPrompt',
  input: {
    schema: SuggestRepeatOrderInputSchema,
  },
  output: {
    schema: SuggestRepeatOrderOutputSchema,
  },
  prompt: `You are a helpful shopping assistant. A user has the following purchase history:

Has previous order: {{hasPreviousOrder}}
{% if hasPreviousOrder %}
Previous order items: {{#each previousOrderItems}}{{{this}}}, {{/each}}
{% endif %}

Based on this purchase history, determine whether to suggest repeating the previous order. Consider factors like whether the user has a previous order and what was in it.

Output in JSON format:
{
  "shouldSuggestRepeatOrder": boolean, // true if you should suggest repeating the order, false otherwise
  "suggestionReason": string // A short explanation of why you are or are not suggesting the repeat order.
}
`,
});

const suggestRepeatOrderFlow = ai.defineFlow(
  {
    name: 'suggestRepeatOrderFlow',
    inputSchema: SuggestRepeatOrderInputSchema,
    outputSchema: SuggestRepeatOrderOutputSchema,
  },
  async input => {
    if (!input.hasPreviousOrder) {
      return {
        shouldSuggestRepeatOrder: false,
        suggestionReason: 'The user does not have a previous order.',
      };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
