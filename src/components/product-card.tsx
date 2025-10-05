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
import { Calendar, Plus } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import StarRating from './star-rating';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.imageHint}
          />
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
            <span>Expires in {product.expirationDays} days</span>
          </div>
        </div>
        <CardDescription className="flex-1 text-base">
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
