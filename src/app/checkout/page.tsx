
'use client';

import {
  CreditCard,
  User,
  Home,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import { useCart } from '@/context/cart-context';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CheckoutPage() {
  const { state, dispatch, total } = useCart();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const handlePlaceOrder = () => {
    // In a real app, you would process the payment here.
    if (state.items.length > 0) {
      dispatch({ type: 'CLEAR_CART' });
    }
    // For now, we'll just simulate a successful order and show a thank you page.
    // A better implementation would be a dedicated /order-confirmation/[orderId] page.
    router.push('/checkout/thank-you'); 
  };
  
  if (isUserLoading) {
    return (
       <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-extrabold font-headline tracking-tight text-primary mb-8 text-center">
            Checkout
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Show different content based on whether user is a guest or logged in */}
              {user && !user.isAnonymous ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Your shipping and payment details are saved. Ready to complete your order?</p>
                     <Separator className="my-6" />
                      <Button size="lg" className="w-full text-lg" onClick={handlePlaceOrder}>
                        Confirm and Place Order
                      </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                <Alert className="mb-6 border-blue-500/50 text-blue-900 bg-blue-50 dark:text-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Already have an account?</AlertTitle>
                    <AlertDescription>
                      <Link href="/login" className="underline font-medium">Sign in now</Link> to autofill your details for a faster checkout experience.
                    </AlertDescription>
                  </Alert>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Home className="w-5 h-5" /> Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" placeholder="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="123 Market St" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Anytown" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" placeholder="CA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" placeholder="12345" />
                        </div>
                      </div>
                  </CardContent>
                </Card>
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                      </div>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="space-y-2">
                          <Label htmlFor="exp-date">Expiration</Label>
                          <Input id="exp-date" placeholder="MM / YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                  </CardContent>
                </Card>
                <div className="mt-8">
                  <Button size="lg" className="w-full text-lg" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                </div>
                </>
              )}
            </div>
            <aside className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {state.items.map(item => (
                       <div key={item.product.id} className="flex justify-between items-center text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                       </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2 font-medium">
                     <div className="flex justify-between">
                       <span>Subtotal</span>
                       <span>${state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
                     </div>
                      <div className="flex justify-between">
                       <span>Shipping</span>
                       <span>Free</span>
                     </div>
                     <div className="flex justify-between text-destructive">
                       <span>Discount</span>
                       <span>-${(state.appliedCoupons.reduce((acc, coupon) => acc + coupon.discountValue, 0)).toFixed(2)}</span>
                     </div>
                  </div>
                   <Separator className="my-4" />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
