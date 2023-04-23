import { renderHook, waitFor, act } from '@testing-library/react';
import useCartStore from '@/store/cart';
import { Server } from 'miragejs';
import { AnyRegistry } from 'miragejs/-types';
import { makeServer } from '@/miragejs/server';
import { ProductInterface } from '@/components/types';

const storeResetFns = new Set<() => unknown>();

const setup = () => {
  const initialState = useCartStore.getState();
  storeResetFns.add(() => useCartStore.setState(initialState, true));
  return renderHook(() => useCartStore());
};

describe('Cart store', () => {
  let server: Server<AnyRegistry>;

  beforeEach(() => {
    act(() => storeResetFns.forEach((resetFn) => resetFn()));
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should return open equals false on inital state', () => {
    const { result } = setup();

    const isCartOpen = result.current.state.open;

    expect(isCartOpen).toBe(false);
  });

  it('should toggle open state', () => {
    const { result } = setup();

    expect(result.current.state.open).toBe(false);
    expect(result.current.state.products).toHaveLength(0);

    act(() => result.current.actions.toggle());
    expect(result.current.state.open).toBe(true);

    act(() => result.current.actions.toggle());
    expect(result.current.state.open).toBe(false);
    expect(result.current.state.products).toHaveLength(0);
  });

  it('should return an empty array for products on initial state', () => {
    const { result } = setup();

    const products = result.current.state.products;

    expect(products).toHaveLength(0);
  });

  it.each([2, 3, 5, 8, 13, 21])('should add %s products to the list', async (quantity: number) => {
    const mockProducts = server.createList('product', quantity) as unknown as ProductInterface[];
    const { result } = setup();
    const add = result.current.actions.add;

    act(() => add(...mockProducts));

    await waitFor(() => {
      expect(result.current.state.products).toHaveLength(quantity);
      expect(result.current.state.open).toBe(true);
    });
  });

  fit('should be possible to add a product that has already been removed from the cart', () => {
    const product = server.create('product') as unknown as ProductInterface;

    const { result } = setup();
    const add = result.current.actions.add;
    const remove = result.current.actions.remove;

    act(() => {
      add(product);
      remove(product.id);
      add(product);
    });

    expect(result.current.state.products[0].quantity).toBe(1);
  });

  it('should assign 1 as initial quantity on product add()', () => {
    const product = server.create('product') as unknown as ProductInterface;
    const { result } = setup();
    const add = result.current.actions.add;

    act(() => add(product));

    expect(result.current.state.products[0].quantity).toBe(1);
  });

  it('should increase quantity', () => {
    const product = server.create('product') as unknown as ProductInterface;
    const { result } = setup();
    const add = result.current.actions.add;
    const increase = result.current.actions.increase;

    act(() => {
      add(product);
      increase(product.id);
    });

    expect(result.current.state.products[0].quantity).toBe(2);
  });

  it('shouldnt increase quantity when product dont exists in the product list', () => {
    const product = server.create('product') as unknown as ProductInterface;
    const { result } = setup();
    const increase = result.current.actions.increase;

    act(() => {
      increase(product.id);
    });

    expect(result.current.state.products).toHaveLength(0);
  });

  it('should increase quantity', () => {
    const product = server.create('product') as unknown as ProductInterface;
    const { result } = setup();
    const add = result.current.actions.add;
    const decrease = result.current.actions.decrease;

    act(() => {
      add(product);
      decrease(product.id);
    });

    expect(result.current.state.products[0].quantity).toBe(0);
  });

  it('shouldnt increase quantity when product dont exist in the product list', () => {
    const product = server.create('product') as unknown as ProductInterface;
    const { result } = setup();
    const decrease = result.current.actions.decrease;

    act(() => {
      decrease(product.id);
    });

    expect(result.current.state.products).toHaveLength(0);
  });

  it('should NOT decrease below zero', () => {
    const product = server.create('product') as unknown as ProductInterface;
    const { result } = setup();
    const add = result.current.actions.add;
    const decrease = result.current.actions.decrease;

    act(() => {
      add(product);
      decrease(product.id);
      decrease(product.id);
    });

    expect(result.current.state.products[0].quantity).toBe(0);
  });

  it('should increase quantity when add same product twice', () => {
    const mockProduct = server.create('product') as unknown as ProductInterface;
    const { result } = setup();

    const add = result.current.actions.add;

    expect(result.current.state.products).toHaveLength(0);

    act(() => add(mockProduct));
    act(() => add(mockProduct));

    expect(result.current.state.open).toBe(true);
    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0].quantity).toBe(2);
  });
});
