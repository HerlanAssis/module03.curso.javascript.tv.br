import { renderHook, waitFor } from '@testing-library/react';
import useFetchProducts from './use-fetch-products';
import { Response, Server } from 'miragejs';
import { AnyRegistry } from 'miragejs/-types';
import { makeServer } from '@/miragejs/server';

const setup = () => {
  return renderHook(() => useFetchProducts());
};

describe('useFetchProducts', () => {
  let server: Server<AnyRegistry>;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render the custom hook', async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current).toMatchObject({ products: [], error: null, loading: false });
    });
  });

  it('should render product list with 10 items', async () => {
    const quantity = 10;
    server.createList('product', quantity);

    const { result } = setup();

    await waitFor(() => {
      expect(result.current.products).toHaveLength(quantity);
    });
  });

  it('should return loading flag', async () => {
    const quantity = 10;
    server.createList('product', quantity);

    const { result } = setup();

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should return error message when server return code 500', async () => {
    const message = 'Erro ao carregar a lista';
    server.get('products', () => {
      return new Response(500, {}, { message });
    });

    const { result } = setup();

    await waitFor(() => {
      expect(result.current.error?.message).toBe(message);
    });
  });
});
