
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
  appliedCoupon: Coupon | null;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: Coupon | null };

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
    case 'APPLY_COUPON': {
      return { ...state, appliedCoupon: action.payload };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], appliedCoupon: null };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    appliedCoupon: null,
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
    if (!state.appliedCoupon) return 0;

    let applicableValue = subtotal;

    if (state.appliedCoupon.eligible_item_names || state.appliedCoupon.eligible_brands) {
      applicableValue = state.items.reduce((total, item) => {
        const isEligible = 
          state.appliedCoupon?.eligible_item_names?.includes(item.product.name) ||
          state.appliedCoupon?.eligible_brands?.includes(item.product.brand);
        
        if (isEligible) {
          return total + item.product.price * item.quantity;
        }
        return total;
      }, 0);
    }
    
    if (state.appliedCoupon.discountType === 'percentage') {
      return applicableValue * state.appliedCoupon.discountValue;
    }
    if (state.appliedCoupon.discountType === 'fixed') {
      return Math.min(applicableValue, state.appliedCoupon.discountValue);
    }
    return 0;
  }, [state.items, state.appliedCoupon, subtotal]);

  const total = useMemo(() => subtotal - discount, [subtotal, discount]);


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
