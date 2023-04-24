import { ProductInterface } from '@/components/types';
import { create } from 'zustand';
import { produce } from 'immer';
import { CartStateInterface, CartStoreStateInterface, CartStoreType } from './types';

const initialState: CartStoreStateInterface = {
  open: false,
  products: [],
};

const CartStore: CartStoreType = (set) => {
  const setState = (fn: (draft: CartStateInterface) => void) => set((store) => produce(store, fn));

  const mapProductHashTableToArray = (products: Map<string, ProductInterface>) =>
    Array.from(products.values());

  const mapProductListToHashTable = (
    products: ProductInterface[],
    uniqueKey: keyof Omit<ProductInterface, 'quantity'> = 'id',
  ) => {
    return new Map<string, ProductInterface>(
      products.map((product) => [product[uniqueKey], product]),
    );
  };

  return {
    state: {
      ...initialState,
    },
    actions: {
      toggle: () => {
        setState(({ state }) => {
          state.open = !state.open;
        });
      },
      add: (...products: ProductInterface[]) => {
        setState(({ state }) => {
          const productTable = mapProductListToHashTable(state.products);

          products.forEach((newProduct) => {
            const product = productTable.get(newProduct.id) || newProduct;

            if (!productTable.get(product.id)) {
              product.quantity = 0;
            }

            product.quantity = (product?.quantity ?? 0) + 1;

            productTable.set(product.id, product);
          });

          state.open = true;
          state.products = mapProductHashTableToArray(productTable);
        });
      },
      increase: (productId: string) => {
        setState(({ state }) => {
          const productIndex = state.products.findIndex(({ id }) => id === productId);

          if (productIndex !== -1) {
            state.products[productIndex].quantity =
              (state.products[productIndex]?.quantity ?? 0) + 1;
          }
        });
      },
      decrease: (productId: string) => {
        setState(({ state }) => {
          const productIndex = state.products.findIndex(({ id }) => id === productId);

          if (productIndex !== -1) {
            if ((state.products[productIndex].quantity ?? 0) > 0) {
              state.products[productIndex].quantity =
                (state.products[productIndex]?.quantity ?? 0) - 1;
            }
          }
        });
      },
      remove: (...productIds) => {
        setState(({ state }) => {
          state.products = state.products.filter((product) => !productIds.includes(product.id));
        });
      },
      clear: () =>
        setState((store) => {
          store.state = { ...initialState };
        }),
    },
  };
};

const useCartStore = create<CartStateInterface>(CartStore);

export default useCartStore;
