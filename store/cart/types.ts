import { ProductInterface } from '@/components/types';
import { StateCreator } from 'zustand';

interface CartStoreStateInterface {
  open: boolean;
  products: ProductInterface[];
}

interface CartStoreStateActions {
  toggle: () => void;
  add: (...product: ProductInterface[]) => void;
}

export interface CartStateInterface {
  state: CartStoreStateInterface;
  actions: CartStoreStateActions;
}

export type CartStoreType = StateCreator<CartStateInterface>;
