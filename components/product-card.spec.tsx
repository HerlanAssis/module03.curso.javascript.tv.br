import { fireEvent, render, screen } from '@testing-library/react';
import ProductCard from './product-card';
import { ProductCardInterface } from './types';

const setup = (overrides?: Partial<ProductCardInterface>) => {
  const product = {
    title: 'Relógio bonito',
    price: '22.00',
    image:
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  };
  const props = {
    product,
    addToCart: () => {},
  };
  const renderResult = render(<ProductCard {...props} {...overrides} />);

  return { ...renderResult, product };
};

describe('ProductCart', () => {
  it('should render the component', () => {
    setup();

    expect(screen.getByTestId('product-cart-tid')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    const { product } = setup();

    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('pimage-tid')).toHaveStyle({
      backgroundImage: product.image,
    });
  });

  it('should call props.addToCart() when button gets clicked', () => {
    const addToCart = jest.fn();
    const { product } = setup({ addToCart });

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});
