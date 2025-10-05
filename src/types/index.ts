
import placeholderData from '@/lib/placeholder-images.json';
import { differenceInDays, parseISO } from 'date-fns';

const imageMap = new Map(
  placeholderData.map((img: { id: string; imageUrl: string; imageHint: string; }) => [
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
  discountValue: number;
  discountType: 'percentage' | 'fixed';
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
    const id = `prod_${p.brand.replace(/\s+/g, '-')}_${index + 1}`;
    const { url, hint } = getProductImage(id);
    const expirationDate = parseISO(p.expiration_date);
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
      rating: p.rating,
      expirationDays: differenceInDays(expirationDate, new Date()),
      imageUrl: url,
      imageHint: hint,
      couponEligible: p.couponEligible ?? Math.random() > 0.5,
      onSale: p.onSale ?? Math.random() > 0.5,
      snapEligible: p.snapEligible ?? Math.random() > 0.5,
    };
  });
};

    