
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
  ArrowRight,
  CreditCard,
  Bookmark,
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
import { useMemo } from 'react';
import { Coupon } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { useAuth, initiateAnonymousSignIn, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';


export default function ShoppingCartSheet() {
  const { state, dispatch, subtotal, discount, total } = useCart();
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const handleSaveForLater = (id: string) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: { id } });
     toast({
      title: 'Item Saved',
      description: 'The item has been moved to your "Saved for Later" list.',
    });
  };

  const handleMoveToCart = (id: string) => {
    dispatch({ type: 'MOVE_TO_CART', payload: { id } });
     toast({
      title: 'Item Moved to Cart',
      description: 'The item has been moved back to your shopping cart.',
    });
  };

  const handleRemoveSavedItem = (id: string) => {
    dispatch({ type: 'REMOVE_SAVED_ITEM', payload: { id } });
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

  const handleGuestCheckout = () => {
    initiateAnonymousSignIn(auth);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="h-full flex flex-col">
      {state.items.length > 0 && (
        <div className="relative mt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="coupon" className="font-semibold">
              Available Coupons
            </Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex gap-2 flex-wrap">
                {eligibleCoupons.length > 0 ? (
                  eligibleCoupons.map((coupon) => (
                    <Badge
                      key={coupon.code}
                      variant={
                        state.appliedCoupons.some(
                          (c) => c.code === coupon.code
                        )
                          ? 'default'
                          : 'outline'
                      }
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
      )}
      <Separator className="my-4" />
      <ScrollArea className="flex-1 -mx-6">
        <div className="space-y-4 px-6">
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
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
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
                     <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleSaveForLater(item.product.id)}>
                      <Bookmark className="mr-1 h-3 w-3" />
                      Save
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
         {state.savedForLater.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="px-6">
              <h3 className="text-lg font-semibold mb-2">Saved for Later</h3>
              <div className="space-y-4">
                {state.savedForLater.map((item) => (
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
                         <Button size="sm" className="h-7" onClick={() => handleMoveToCart(item.product.id)}>
                          Move to Cart
                        </Button>
                         <Button variant="ghost" size="sm" className="h-7" onClick={() => handleRemoveSavedItem(item.product.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </ScrollArea>
      {state.items.length > 0 && (
        <div className="mt-auto border-t -mx-6 px-6 pt-4 space-y-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">-${discount.toFixed(2)}</span>
            </div>
            )}
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
           {discount > 0 && (
            <p className="text-sm text-green-600 font-semibold text-center">
              You saved ${discount.toFixed(2)}!
            </p>
          )}
          {user ? (
            <Button size="lg" className="w-full text-lg" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <CheckoutDialog onGuestCheckout={handleGuestCheckout} />
          )}
        </div>
      )}
    </div>
  );
}

const CheckoutDialog = ({ onGuestCheckout }: { onGuestCheckout: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="lg" className="w-full text-lg">
        Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="font-headline text-2xl flex items-center gap-2">
          <CreditCard className="text-primary" />
          Ready to Checkout?
        </AlertDialogTitle>
        <AlertDialogDescription className="pt-2">
          To save your order history and get personalized recommendations, create
          an account. Or, you can quickly continue as a guest.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="grid grid-cols-2 gap-4">
        <AlertDialogAction asChild>
          <Link href="/login">Create My Account</Link>
        </AlertDialogAction>
        <AlertDialogCancel onClick={onGuestCheckout}>Continue as Guest</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
