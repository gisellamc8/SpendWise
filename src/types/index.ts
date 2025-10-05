
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
    const simpleHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

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
      couponEligible: p.couponEligible ?? (simpleHash(id + 'coupon') % 2 === 0),
      onSale: p.onSale ?? (simpleHash(id + 'sale') % 3 === 0),
      snapEligible: p.snapEligible ?? (simpleHash(id + 'snap') % 4 === 0),
    };
  });
};
