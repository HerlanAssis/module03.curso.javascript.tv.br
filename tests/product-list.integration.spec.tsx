import { makeServer } from '@/miragejs/server';
import ProductList from '@/pages/index';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Response, Server } from 'miragejs';
import { AnyRegistry } from 'miragejs/-types';

const setup = () => {
  const user = userEvent.setup();
  const renderResult = render(<ProductList />);
  return { ...renderResult, user };
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

  it('should display error message when promise rejects', async () => {
    const message = 'Unit test - Erro ao carregar lista';
    server.get('products', () => {
      return new Response(500, {}, { message });
    });

    setup();

    await waitFor(() => {
      expect(screen.getByText(new RegExp(message, 'i'))).toBeInTheDocument();
      expect(screen.queryByTestId('empty-product-list-tid')).toBeNull();
      expect(screen.queryAllByTestId('product-cart-tid')).toHaveLength(0);
    });
  });

  it('should render the Search component', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByTestId('search-tid')).toBeInTheDocument();
    });
  });

  it('should filter the product list when search is performed', async () => {
    const quantity = 10;
    const customProductTitle = 'Relógio bonito';
    server.createList('product', quantity);
    server.create('product', {
      title: customProductTitle,
    } as any);

    const { user } = setup();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-cart-tid')).toHaveLength(11);
    });

    const input = await screen.findByPlaceholderText('Search');
    const form = await screen.findByRole('form');

    await user.type(input, customProductTitle);
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(customProductTitle, 'i'))).toBeInTheDocument();
      expect(screen.getAllByTestId('product-cart-tid')).toHaveLength(1);
    });
  });

  it('should display product (singular) when there is only 1 product', async () => {
    server.create('product');

    setup();

    await waitFor(() => {
      expect(screen.getByText(new RegExp('1 product', 'i'))).toBeInTheDocument();
    });
  });

  it('should display products (plural) when has more than 1 product', async () => {
    const quantity = 10;
    server.createList('product', quantity);

    setup();

    await waitFor(() => {
      expect(screen.getByText(new RegExp('10 products', 'i'))).toBeInTheDocument();
    });
  });

  it('should display proper quantity when list is filtered', async () => {
    const quantity = 10;
    const searchTerm = 'Relógio';
    server.createList('product', quantity);
    server.create('product', {
      title: 'Relógio bonito',
    } as any);
    server.create('product', {
      title: 'Relógio top',
    } as any);

    const { user } = setup();

    const input = await screen.findByPlaceholderText('Search');
    const form = await screen.findByRole('form');

    await user.type(input, searchTerm);
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(new RegExp('2 products', 'i'))).toBeInTheDocument();
    });
  });
});
