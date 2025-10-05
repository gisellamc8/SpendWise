'use server';
import {
  suggestRepeatOrder,
  type SuggestRepeatOrderInput,
  type SuggestRepeatOrderOutput,
} from '@/ai/flows/repeat-order-suggestion';
import { previousOrderItems } from '@/lib/data';

export async function getRepeatOrderSuggestion(): Promise<SuggestRepeatOrderOutput> {
  try {
    const input: SuggestRepeatOrderInput = {
      userId: 'guest-user-123',
      hasPreviousOrder: previousOrderItems.length > 0,
      previousOrderItems: previousOrderItems.map((item) => item.name),
    };
    const suggestion = await suggestRepeatOrder(input);
    return suggestion;
  } catch (error) {
    console.error('Error getting repeat order suggestion:', error);
    return {
      shouldSuggestRepeatOrder: false,
      suggestionReason: 'An error occurred while fetching suggestion.',
    };
  }
}
