'use client';

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';

export default function ShoppingCartSheet() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <span>Shopping Cart</span>
          <BadgeCart count={totalItems} />
        </CardTitle>
        <CardDescription>
          Your selected items for purchase.
        </CardDescription>
        <div className="relative mt-2">
            <p className="text-xs text-muted-foreground text-center bg-card p-2 rounded-md border border-dashed">The Coupon field is unintrusive.</p>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-4">
          <div className="space-y-4">
            {state.items.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <ShoppingCart className="mx-auto h-12 w-12" />
                <p className="mt-4">Your cart is empty.</p>
              </div>
            ) : (
              state.items.map((item) => (
                <div key={item.product.id} className="flex items-start gap-4">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                    data-ai-hint={item.product.imageHint}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => handleRemoveItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      {state.items.length > 0 && (
        <CardFooter className="flex-col items-stretch space-y-4">
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <CheckoutDialog />
        </CardFooter>
      )}
    </Card>
  );
}

const CheckoutDialog = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="lg" className="w-full">
        Proceed to Checkout
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="font-headline">
          Create an Account?
        </AlertDialogTitle>
        <AlertDialogDescription>
          For a better experience and to save your order history, create an
          account. Or, you can continue as a guest.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Continue as Guest</AlertDialogCancel>
        <AlertDialogAction>Create Account</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const BadgeCart = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <div className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
      {count}
    </div>
  );
};
