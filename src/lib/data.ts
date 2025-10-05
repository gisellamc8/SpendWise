import { Product, Coupon, Notification } from '@/types';
import { getProductImage } from '@/types';

const productData: Omit<Product, 'imageUrl' | 'imageHint'>[] = [
  {
    id: 'prod_1',
    name: 'Organic Bananas',
    price: 1.25,
    rating: 5,
    expirationDays: 5,
    couponEligible: true,
    onSale: false,
    snapEligible: true,
  },
  {
    id: 'prod_2',
    name: 'Whole Milk',
    price: 3.5,
    rating: 4,
    expirationDays: 10,
    onSale: true,
    snapEligible: true,
  },
  {
    id: 'prod_3',
    name: 'Sourdough Bread',
    price: 4.99,
    rating: 5,
    expirationDays: 7,
    couponEligible: true,
    snapEligible: false,
  },
  {
    id: 'prod_4',
    name: 'Crisp Red Apples',
    price: 2.99,
    rating: 4.6,
    expirationDays: 14,
    snapEligible: true,
  },
  {
    id: 'prod_5',
    name: 'Chicken Breast',
    price: 8.75,
    rating: 5,
    expirationDays: 4,
    onSale: true,
    couponEligible: true,
  },
  {
    id: 'prod_6',
    name: 'Romaine Lettuce',
    price: 2.5,
    rating: 3.8,
    expirationDays: 8,
    snapEligible: true,
  },
];

export const products: Product[] = productData.map((p) => {
  const { url, hint } = getProductImage(p.id);
  return {
    ...p,
    imageUrl: url,
    imageHint: hint,
  };
});

export const newArrivals: Product[] = products.slice(0, 3);
export const previousOrderItems: Product[] = products.slice(1, 3);

export const coupons: Coupon[] = [
  {
    code: 'SAVE10',
    title: '10% Off Your Next Order',
    description: 'Valid for all items.',
  },
  {
    code: 'FRESHFRUIT',
    title: '$5 Off Fresh Produce',
    description: 'Minimum purchase of $20.',
  },
];

export const notifications: Notification[] = [
  {
    id: 'notif_1',
    title: 'Expiration Alert',
    description: 'Your Whole Milk expires in 2 days.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif_2',
    title: 'Price Drop',
    description: 'Price for Organic Bananas has dropped!',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif_3',
    title: 'Welcome to WasteNot Wallet',
    description: 'Start shopping and save food!',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];
