'use client';
import Image from 'next/image';
import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Tag, Filter } from 'lucide-react';
import { products, coupons, newArrivals } from '@/lib/data';
import AppHeader from '@/components/app-header';
import ProductCard from '@/components/product-card';
import AppFooter from '@/components/app-footer';
import RepeatOrderSuggestion from '@/components/ai/repeat-order-suggestion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StarRating from '@/components/star-rating';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    couponEligible: false,
    onSale: false,
    snapEligible: false,
  });
  const [ratingFilter, setRatingFilter] = useState(0);

  const handleFilterChange = useCallback((filterName: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) => {
        if (ratingFilter > 0 && product.rating < ratingFilter) return false;
        if (filters.couponEligible && !product.couponEligible) return false;
        if (filters.onSale && !product.onSale) return false;
        if (filters.snapEligible && !product.snapEligible) return false;
        return true;
      });
  }, [searchTerm, filters, ratingFilter]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 space-y-8">
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">
                    New Arrivals
                  </CardTitle>
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

              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">
                    Sales & Coupons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.code}
                      className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                    >
                      <Tag className="text-accent w-8 h-8" />
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

            <section className="lg:col-span-9 space-y-8">
              <RepeatOrderSuggestion />
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search for products..."
                    className="pl-12 h-12 text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Card className="p-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                       <Filter className="h-5 w-5 text-muted-foreground" />
                       <h3 className="text-md font-semibold">Filters:</h3>
                    </div>
                     <div className="flex items-center space-x-2">
                      <Select
                        value={ratingFilter.toString()}
                        onValueChange={(value) =>
                          setRatingFilter(Number(value))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">All Ratings</SelectItem>
                          <SelectItem value="5">
                            <StarRating rating={5} />
                          </SelectItem>
                           <SelectItem value="4">
                            <StarRating rating={4} />
                          </SelectItem>
                          <SelectItem value="3">
                            <StarRating rating={3} />
                          </SelectItem>
                          <SelectItem value="2">
                            <StarRating rating={2} />
                          </SelectItem>
                          <SelectItem value="1">
                            <StarRating rating={1} />
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="couponEligible" checked={filters.couponEligible} onCheckedChange={() => handleFilterChange('couponEligible')} />
                      <Label htmlFor="couponEligible">Coupon Eligible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="onSale" checked={filters.onSale} onCheckedChange={() => handleFilterChange('onSale')} />
                      <Label htmlFor="onSale">On Sale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="snapEligible" checked={filters.snapEligible} onCheckedChange={() => handleFilterChange('snapEligible')} />
                      <Label htmlFor="snapEligible">SNAP Eligible</Label>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
