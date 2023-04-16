import { render, screen, waitFor } from '@testing-library/react';
import { Response, Server } from 'miragejs';
import { AnyRegistry } from 'miragejs/-types';
import { makeServer } from '@/miragejs/server';
import ProductList from '@/pages/index';

const setup = () => {
  const renderResult = render(<ProductList />);
  return { ...renderResult };
};

describe('ProductList', () => {
  let server: Server<AnyRegistry>;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render the component', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByTestId('product-list-tid')).toBeInTheDocument();
    });
  });

  it('should render the loading spinner', () => {
    setup();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render error message when axios call reject', async () => {
    const message = 'Unit test - Erro ao carregar lista';
    server.get('products', () => {
      return new Response(500, {}, { message });
    });

    setup();

    await waitFor(() => {
      expect(screen.getByText(new RegExp(message, 'i'))).toBeInTheDocument();
    });
  });

  it('should render the ProductCart component 10 times', async () => {
    const quantity = 10;
    server.createList('product', quantity);

    setup();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-cart-tid')).toHaveLength(quantity);
    });
  });

  it('should render empty state for product list', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByTestId('empty-product-list-tid')).toBeInTheDocument();
    });
  });

  it.todo('should render the Search component');

  it.todo('should filter the product list when search is performed');

  it.todo('should display error message when promise rejects');

  it.todo('should display the total quantity of products');

  it.todo('should display product (singular) when there is only 1 product');

  it.todo('should display products (plural) when has more than 1 product');
});
