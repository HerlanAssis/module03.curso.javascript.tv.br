import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CartItem from '@/components/cart-item';
import { CartItemInterface } from '@/components/types';
import { useCartStore } from '@/store';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('@/store', () => ({
  useCartStore: jest.fn(() => ({ remove: () => {} })),
}));

const setup = (overrides?: Partial<CartItemInterface>) => {
  const product = {
    id: '1',
    title: 'Relógio bonito',
    price: '22.00',
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  };
  const props = {
    product,
  };
  const renderResult = render(<CartItem {...props} {...overrides} />);

  return { ...renderResult, product };
};

describe('CartItem', () => {
  it('should render the component', () => {
    setup();

    expect(screen.getByTestId('cart-item-tid')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    const { product } = setup();

    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('pimage-tid').getAttribute('src')).toBe(product.image);
    expect(screen.getByTestId('pimage-tid')).toHaveProperty('alt', product.title);
  });

  it('should call store.decrease() when decrease button gets clicked', async () => {
    const decrease = jest.fn();
    jest.mocked(useCartStore).mockImplementationOnce(() => ({ decrease }));

    const { product } = setup();

    const decreaseButton = screen.getByTestId('decrease-button-tid');

    fireEvent.click(decreaseButton);

    expect(decrease).toHaveBeenCalledTimes(1);
    expect(decrease).toHaveBeenCalledWith(product.id);
  });

  it('should call store.increase() when increase button gets clicked', () => {
    const increase = jest.fn();
    jest.mocked(useCartStore).mockImplementationOnce(() => ({ increase }));

    const { product } = setup();

    const increaseButton = screen.getByTestId('increase-button-tid');

    fireEvent.click(increaseButton);

    expect(increase).toHaveBeenCalledTimes(1);
    expect(increase).toHaveBeenCalledWith(product.id);
  });

  it("should remove item when 'Remove item' button gets clicked", () => {
    const remove = jest.fn();
    jest.mocked(useCartStore).mockImplementationOnce(() => ({ remove }));

    const { product } = setup();

    const button = screen.getByTestId('remove-button-tid');

    fireEvent.click(button);

    expect(remove).toBeCalledTimes(1);
    expect(remove).toBeCalledWith(product.id);
  });
});
