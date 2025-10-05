
'use client';

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart, Trash2, X, Sparkles } from 'lucide-react';
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
import { coupons } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';
import { useMemo, useState } from 'react';
import { Coupon } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function ShoppingCartSheet() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');
  const { toast } = useToast();

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const eligibleCoupons = useMemo(() => {
    const cartBrands = new Set(state.items.map((item) => item.product.brand));
    const cartItemNames = new Set(
      state.items.map((item) => item.product.name)
    );

    return coupons.filter((coupon) => {
      if (!coupon.eligible_brands && !coupon.eligible_item_names) {
        return true; // Coupon is generic
      }
      if (
        coupon.eligible_brands &&
        coupon.eligible_brands.some((brand) => cartBrands.has(brand))
      ) {
        return true;
      }
      if (
        coupon.eligible_item_names &&
        coupon.eligible_item_names.some((name) => cartItemNames.has(name))
      ) {
        return true;
      }
      return false;
    });
  }, [state.items]);

  const applyBestCoupon = () => {
    if (eligibleCoupons.length > 0) {
      // Simple logic: apply the first eligible coupon
      const bestCoupon = eligibleCoupons[0];
      setSelectedCoupon(bestCoupon.code);
      toast({
        title: 'Coupon Applied!',
        description: `${bestCoupon.title}`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'No eligible coupons',
        description: 'Your cart does not qualify for any available coupons.',
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative mt-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="coupon">Apply a Coupon</Label>
          <div className="flex gap-2">
            <Select
              value={selectedCoupon}
              onValueChange={setSelectedCoupon}
              disabled={eligibleCoupons.length === 0}
            >
              <SelectTrigger id="coupon" className="w-full">
                <SelectValue placeholder="Select an eligible coupon" />
              </SelectTrigger>
              <SelectContent>
                {eligibleCoupons.length > 0 ? (
                  eligibleCoupons.map((coupon) => (
                    <SelectItem key={coupon.code} value={coupon.code}>
                      <div className="flex flex-col">
                        <p className="font-semibold">{coupon.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {coupon.description}
                        </p>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No eligible coupons for your current items.
                  </div>
                )}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={applyBestCoupon}
              aria-label="Apply Best Coupon"
              disabled={eligibleCoupons.length === 0}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 my-4 pr-4">
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
                        handleQuantityChange(item.product.id, item.quantity - 1)
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
                        handleQuantityChange(item.product.id, item.quantity + 1)
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
      {state.items.length > 0 && (
        <div className="mt-auto border-t pt-4">
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <CheckoutDialog />
        </div>
      )}
    </div>
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
