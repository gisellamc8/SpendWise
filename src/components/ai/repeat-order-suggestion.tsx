'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lightbulb, ShoppingBasket, X } from 'lucide-react';
import { getRepeatOrderSuggestion } from '@/app/actions';
import type { SuggestRepeatOrderOutput } from '@/ai/flows/repeat-order-suggestion';
import { useCart } from '@/context/cart-context';
import { previousOrderItems } from '@/lib/data';

export default function RepeatOrderSuggestion() {
  const [suggestion, setSuggestion] = useState<SuggestRepeatOrderOutput | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchSuggestion() {
      const result = await getRepeatOrderSuggestion();
      if (result.shouldSuggestRepeatOrder) {
        setSuggestion(result);
        setIsVisible(true);
      }
    }
    fetchSuggestion();
  }, []);

  const handleAddAllToCart = () => {
    previousOrderItems.forEach((item) => addToCart(item));
    setIsVisible(false);
  };

  if (!isVisible || !suggestion) {
    return null;
  }

  return (
    <Alert className="bg-primary/10 border-primary/20">
      <Lightbulb className="h-4 w-4 text-primary" />
      <div className="flex justify-between items-start">
        <div>
          <AlertTitle className="font-headline text-primary">
            Quick Shopping Tip!
          </AlertTitle>
          <AlertDescription>{suggestion.suggestionReason}</AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 flex gap-4">
        <Button onClick={handleAddAllToCart}>
          <ShoppingBasket className="mr-2 h-4 w-4" /> Repeat Previous Order
        </Button>
        <Button variant="ghost" onClick={() => setIsVisible(false)}>
          No, thanks
        </Button>
      </div>
    </Alert>
  );
}
