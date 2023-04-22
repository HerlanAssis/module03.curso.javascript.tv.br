import Cart from '@/components/cart';
import { ProductInterface } from '@/components/types';
import { makeServer } from '@/miragejs/server';
import { useCartStore } from '@/store';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Server } from 'miragejs';
import { AnyRegistry } from 'miragejs/-types';

const storeResetFns = new Set<() => unknown>();

const setup = () => {
  const user = userEvent.setup();
  const initialState = useCartStore.getState();

  storeResetFns.add(() => useCartStore.setState(initialState, true));

  const { result: resultCartStore } = renderHook(() => useCartStore());
  const renderResult = render(<Cart />);
  return { ...renderResult, resultCartStore, user };
};

describe('Cart', () => {
  let server: Server<AnyRegistry>;

  beforeEach(() => {
    act(() => storeResetFns.forEach((resetFn) => resetFn()));
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render the component', () => {
    setup();

    expect(screen.getByText(/There are no items in the cart./i)).toBeInTheDocument();
    expect(screen.getByTestId('cart-tid')).toBeInTheDocument();
  });

  it('should add css class "hidden" in the component', () => {
    setup();

    expect(screen.getByTestId('cart-tid')).toHaveClass('hidden');
  });

  it('shouldnt add css class "hidden" when Cart is opened', () => {
    const { resultCartStore } = setup();

    act(() => resultCartStore.current.actions.toggle());

    expect(screen.getByTestId('cart-tid')).not.toHaveClass('hidden');
  });

  it('should call store.toggle() twice', () => {
    const { resultCartStore } = setup();

    const button = screen.getByTestId('toggle-cart-tid');
    const spyToggle = jest.spyOn(resultCartStore.current.actions, 'toggle');

    act(() => resultCartStore.current.actions.toggle());
    expect(screen.getByTestId('cart-tid')).not.toHaveClass('hidden');

    fireEvent.click(button);

    expect(screen.getByTestId('cart-tid')).toHaveClass('hidden');
    expect(spyToggle).toHaveBeenCalledTimes(2);
  });

  it.each([2, 3, 5, 8, 13, 21])('should display %s products cards', async (quantity) => {
    const products = server.createList('product', quantity) as unknown as ProductInterface[];

    const { resultCartStore } = setup();

    act(() => resultCartStore.current.actions.add(...products));

    const productList = screen.getAllByTestId('cart-item-tid');

    expect(resultCartStore.current.state.open).toBe(true);
    expect(screen.getByTestId('cart-tid')).not.toHaveClass('hidden');
    expect(productList).toHaveLength(quantity);
  });

  it('should remove a product from the store', async () => {
    const [product1, product2] = server.createList('product', 2) as unknown as ProductInterface[];

    const { resultCartStore } = setup();

    act(() => resultCartStore.current.actions.add(product1, product2));

    let productList = screen.getAllByTestId('cart-item-tid');
    expect(productList).toHaveLength(2);

    act(() => resultCartStore.current.actions.remove(product1.id));
    productList = screen.getAllByTestId('cart-item-tid');

    expect(productList).toHaveLength(1);
    expect(resultCartStore.current.state.products[0]).toEqual(product2);
  });

  it('should not chage products in the cart if provided product is not in the cart', async () => {
    const [product1, product2, product3] = server.createList(
      'product',
      3,
    ) as unknown as ProductInterface[];

    const { resultCartStore } = setup();

    act(() => resultCartStore.current.actions.add(product1, product2));

    let productList = screen.getAllByTestId('cart-item-tid');
    expect(productList).toHaveLength(2);

    act(() => resultCartStore.current.actions.remove(product3.id));
    productList = screen.getAllByTestId('cart-item-tid');

    expect(productList).toHaveLength(2);
  });

  it('should clear cart', async () => {
    const [product1, product2] = server.createList('product', 2) as unknown as ProductInterface[];

    const { resultCartStore } = setup();

    act(() => resultCartStore.current.actions.add(product1, product2));

    let productList = screen.getAllByTestId('cart-item-tid');
    expect(productList).toHaveLength(2);

    act(() => resultCartStore.current.actions.clear());
    productList = screen.queryAllByTestId('cart-item-tid');

    expect(productList).toHaveLength(0);
  });
});
