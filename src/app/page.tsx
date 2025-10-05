import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Tag } from 'lucide-react';
import { products, coupons, newArrivals } from '@/lib/data';
import AppHeader from '@/components/app-header';
import ProductCard from '@/components/product-card';
import AppFooter from '@/components/app-footer';
import RepeatOrderSuggestion from '@/components/ai/repeat-order-suggestion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <RepeatOrderSuggestion />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search for products..."
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* Left Column - New Arrivals */}
            <aside className="lg:col-span-3 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">New Arrivals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {newArrivals.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                        data-ai-hint={item.imageHint}
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>

            {/* Center Column - Products */}
            <section className="lg:col-span-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Right Column - Sales & Coupons */}
            <aside className="lg:col-span-3 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">
                    Sales & Coupons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.code}
                      className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                    >
                      <Tag className="text-primary w-8 h-8" />
                      <div>
                        <p className="font-bold">{coupon.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.description}
                        </p>
                      </div>
                    </div>
                  ))}
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
