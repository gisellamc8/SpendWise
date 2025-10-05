
import placeholderData from '@/lib/placeholder-images.json';
import { differenceInDays } from 'date-fns';

const imageMap = new Map(
  placeholderData.placeholderImages.map((img) => [
    img.id,
    { url: img.imageUrl, hint: img.imageHint },
  ])
);

export type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  aisle: number;
  shelf: string;
  calories: number;
  nutrition: string;
  stock: number;
  sustainability: number;
  expirationDate: Date;
  rating: number; // 1-5
  expirationDays: number;
  imageUrl: string;
  imageHint: string;
  couponEligible?: boolean;
  onSale?: boolean;
  snapEligible?: boolean;
};

export const getProductImage = (
  id: string
): { url: string; hint: string } => {
  return imageMap.get(id) || { url: `https://picsum.photos/seed/${id}/600/400`, hint: 'product image' };
};

export type Coupon = {
  code: string;
  title: string;
  description: string;
  eligible_brands?: string[];
  eligible_item_names?: string[];
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  date: Date;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export const processProductData = (data: any[]): Product[] => {
  return data.map((p, index) => {
    const id = `prod_${index + 1}`;
    const { url, hint } = getProductImage(id);
    const expirationDate = new Date(p.expiration_date);
    return {
      id: id,
      brand: p.brand,
      name: p.item_name,
      price: p.price,
      aisle: p.aisle,
      shelf: p.shelf,
      calories: p.calories,
      nutrition: p.nutrition,
      stock: p.stock,
      sustainability: p.sustainability,
      expirationDate: expirationDate,
      rating: Math.floor(Math.random() * 5) + 1,
      expirationDays: differenceInDays(expirationDate, new Date()),
      imageUrl: url,
      imageHint: hint,
      couponEligible: Math.random() > 0.5,
      onSale: Math.random() > 0.5,
      snapEligible: Math.random() > 0.5,
    };
  });
};
