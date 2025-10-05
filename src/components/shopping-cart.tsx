
'use client';

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Tag,
} from 'lucide-react';
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
import { Label } from './ui/label';
import { useMemo, useState } from 'react';
import { Coupon } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export default function ShoppingCartSheet() {
  const { state, dispatch, subtotal, discount, total } = useCart();
  const [selectedCoupons, setSelectedCoupons] = useState<Coupon[]>([]);
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
        return true;
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

  const handleCouponSelect = (coupon: Coupon) => {
    dispatch({ type: 'TOGGLE_COUPON', payload: coupon });
    if (state.appliedCoupons.some((c) => c.code === coupon.code)) {
       toast({
        variant: 'destructive',
        title: 'Coupon Removed!',
        description: `${coupon.title}`,
      });
    } else {
       toast({
        title: 'Coupon Applied!',
        description: `${coupon.title}`,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative mt-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="coupon">Apply a Coupon</Label>
          <div className="flex gap-2 items-center">
            <div className="flex-1 flex gap-2 flex-wrap">
              {eligibleCoupons.length > 0 ? (
                eligibleCoupons.map((coupon) => (
                  <Badge
                    key={coupon.code}
                    variant={state.appliedCoupons.some(c => c.code === coupon.code) ? 'default' : 'outline'}
                    className={cn('cursor-pointer flex gap-1.5 items-center')}
                    onClick={() => handleCouponSelect(coupon)}
                  >
                    <Tag className="h-3 w-3" />
                    {coupon.title}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground p-2">
                  No coupons available for your current items.
                </p>
              )}
            </div>
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
        <div className="mt-auto border-t pt-4 space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
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
