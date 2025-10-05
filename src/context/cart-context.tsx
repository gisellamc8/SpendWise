
'use client';

import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import { CartItem, Product, Coupon } from '@/types';
import { useToast } from '@/hooks/use-toast';

type CartState = {
  items: CartItem[];
  appliedCoupons: Coupon[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_COUPON'; payload: Coupon };

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
      addToCart: (product: Product) => void;
      totalItems: number;
      subtotal: number;
      discount: number;
      total: number;
    }
  | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.id
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.payload.id
        ),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.payload.id
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'TOGGLE_COUPON': {
      const isApplied = state.appliedCoupons.some(c => c.code === action.payload.code);
      if (isApplied) {
        return {
          ...state,
          appliedCoupons: state.appliedCoupons.filter(c => c.code !== action.payload.code),
        };
      } else {
        return {
          ...state,
          appliedCoupons: [...state.appliedCoupons, action.payload],
        };
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [], appliedCoupons: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    appliedCoupons: [],
  });
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: 'Item Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = useMemo(() => {
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [state.items]);

  const discount = useMemo(() => {
    if (state.appliedCoupons.length === 0) return 0;

    return state.appliedCoupons.reduce((totalDiscount, coupon) => {
        let applicableValue = subtotal;

        if (coupon.eligible_item_names || coupon.eligible_brands) {
        applicableValue = state.items.reduce((total, item) => {
            const isEligible = 
            coupon.eligible_item_names?.includes(item.product.name) ||
            coupon.eligible_brands?.includes(item.product.brand);
            
            if (isEligible) {
            return total + item.product.price * item.quantity;
            }
            return total;
        }, 0);
        }
        
        let currentCouponDiscount = 0;
        if (coupon.discountType === 'percentage') {
            currentCouponDiscount = applicableValue * coupon.discountValue;
        } else if (coupon.discountType === 'fixed') {
            currentCouponDiscount = Math.min(applicableValue, coupon.discountValue);
        }
        
        return totalDiscount + currentCouponDiscount;
    }, 0);

  }, [state.items, state.appliedCoupons, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);


  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        totalItems,
        subtotal,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
