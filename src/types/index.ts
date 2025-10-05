import placeholderData from '@/lib/placeholder-images.json';

const imageMap = new Map(
  placeholderData.placeholderImages.map((img) => [
    img.id,
    { url: img.imageUrl, hint: img.imageHint },
  ])
);

export type Product = {
  id: string;
  name: string;
  price: number;
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
  return imageMap.get(id) || { url: '', hint: '' };
};

export type Coupon = {
  code: string;
  title: string;
  description: string;
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
