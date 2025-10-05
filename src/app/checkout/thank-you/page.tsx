
'use client';

import { CheckCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-lg border">
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            <h1 className="mt-6 text-4xl font-extrabold font-headline tracking-tight text-primary">
              Thank You!
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your order has been successfully placed.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We've cleared your cart for your next shopping trip.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
