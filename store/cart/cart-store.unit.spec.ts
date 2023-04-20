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

  it('shouldnt add the same product twice', () => {
    const mockProduct = server.create('product') as unknown as ProductInterface;
    const { result } = setup();

    const add = result.current.actions.add;

    expect(result.current.state.products).toHaveLength(0);

    act(() => add(mockProduct));
    act(() => add(mockProduct));

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.open).toBe(true);
  });
});
