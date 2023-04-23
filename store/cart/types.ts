import { ProductInterface } from '@/components/types';
import { StateCreator } from 'zustand';

export interface CartStoreStateInterface {
  open: boolean;
  products: ProductInterface[];
}

interface CartStoreStateActions {
  toggle: () => void;
  add: (...product: ProductInterface[]) => void;
  increase: (productId: ProductInterface['id']) => void;
  decrease: (productId: ProductInterface['id']) => void;
  remove: (...productId: string[]) => void;
  clear: () => void;
}

export interface CartStateInterface {
  state: CartStoreStateInterface;
  actions: CartStoreStateActions;
}

export type CartStoreType = StateCreator<CartStateInterface>;
