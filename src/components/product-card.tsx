'use client';

import Image from 'next/image';
import { Product } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Calendar, Plus, Tag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import StarRating from './star-rating';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="p-0 relative">
        <div className="aspect-video relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.imageHint}
          />
        </div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          {product.couponEligible && (
            <Badge
              variant="default"
              className="bg-accent text-accent-foreground"
            >
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              Coupon
            </Badge>
          )}
          {product.snapEligible && (
            <Badge
              variant="default"
              className="bg-green-600/50 hover:bg-green-700/60 text-white"
            >
              SNAP Eligible
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <CardTitle className="text-lg font-headline leading-tight mb-1">
          {product.name}
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <StarRating rating={product.rating} />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Expires {format(product.expirationDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
        <CardDescription className="flex-1 text-base font-bold text-foreground">
          ${product.price.toFixed(2)}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => addToCart(product)}>
          <Plus className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
