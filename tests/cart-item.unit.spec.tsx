import { fireEvent, render, screen } from '@testing-library/react';
import CartItem from '../components/cart-item';
import { CartItemInterface } from '../components/types';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const setup = (overrides?: Partial<CartItemInterface>) => {
  const product = {
    title: 'Relógio bonito',
    price: '22.00',
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

  it('should display 1 as initial quantity', () => {
    setup();

    const quantity = screen.getByTestId('quantity-tid');

    expect(quantity.textContent).toEqual('1');
  });

  it('should decrease quantity when decrease button gets clicked', () => {
    setup();

    const increaseButton = screen.getByTestId('increase-button-tid');
    const decreaseButton = screen.getByTestId('decrease-button-tid');

    let quantity = screen.getByTestId('quantity-tid');
    expect(quantity.textContent).toEqual('1');

    fireEvent.click(increaseButton);
    quantity = screen.getByTestId('quantity-tid');
    expect(quantity.textContent).toEqual('2');

    fireEvent.click(decreaseButton);
    quantity = screen.getByTestId('quantity-tid');

    expect(quantity.textContent).toEqual('1');
  });

  it('should increase quantity when increase button gets clicked', () => {
    setup();

    const increaseButton = screen.getByTestId('increase-button-tid');
    let quantity = screen.getByTestId('quantity-tid');

    expect(quantity.textContent).toEqual('1');

    fireEvent.click(increaseButton);

    quantity = screen.getByTestId('quantity-tid');
    expect(quantity.textContent).toEqual('2');
  });

  it('should not decrease bellow zero when decrease button is repeatly clicked', () => {
    setup();

    const decreaseButton = screen.getByTestId('decrease-button-tid');

    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);

    const quantity = screen.getByTestId('quantity-tid');

    expect(quantity.textContent).toEqual('0');
    expect(screen.getByTestId('decrease-button-tid')).toHaveProperty('disabled', true);
  });
});
