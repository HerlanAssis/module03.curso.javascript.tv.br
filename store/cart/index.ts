import { ProductInterface } from '@/components/types';
import { create } from 'zustand';
import { CartStateInterface, CartStoreStateInterface, CartStoreType } from './types';

const CartStore: CartStoreType = (set, get) => {
  const filterProductListToRemoveItemsById = (
    products: ProductInterface[],
    productIds: string[],
  ) => {
    return products.filter((product) => !productIds.includes(product.id));
  };

  const mapProductListToUniqueItemsArray = (
    products: ProductInterface[],
    uniqueKey: keyof ProductInterface = 'id',
  ) => {
    return Array.from(
      new Map<string, ProductInterface>(
        products.map((product) => [product[uniqueKey], product]),
      ).values(),
    );
  };

  const updateState = (
    callback: (store: CartStateInterface) => Partial<CartStoreStateInterface>,
  ) => {
    set((store) => ({
      state: { ...store.state, ...callback(store) },
    }));
  };

  return {
    state: {
      open: false,
      products: [],
    },
    actions: {
      toggle: () =>
        updateState((store) => ({
          open: !store.state.open,
        })),
      add: (...product: ProductInterface[]) =>
        updateState((store) => ({
          open: true,
          products: mapProductListToUniqueItemsArray([...store.state.products, ...product]),
        })),
      remove: (...productIds) =>
        updateState((store) => ({
          products: filterProductListToRemoveItemsById(store.state.products, productIds),
        })),
      clear: () => updateState(() => ({ products: [] })),
    },
  };
};

const useCartStore = create<CartStateInterface>(CartStore);

export default useCartStore;
