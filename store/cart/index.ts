import { create } from 'zustand';
import { CartStateInterface, CartStoreType } from './types';
import { ProductInterface } from '@/components/types';

const CartStore: CartStoreType = (set, get) => ({
  state: {
    open: false,
    products: [],
  },
  actions: {
    toggle: () =>
      set((store) => ({
        state: {
          ...store.state,
          open: !store.state.open,
        },
      })),
    add: (...product: ProductInterface[]) =>
      set((store) => ({
        state: {
          ...store.state,
          products: Array.from(
            new Map<string, ProductInterface>(
              [...store.state.products, ...product].map((product) => [product.id, product]),
            ).values(),
          ),
        },
      })),
  },
});

const useCartStore = create<CartStateInterface>(CartStore);

export default useCartStore;
