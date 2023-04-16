import { render, screen, waitFor } from '@testing-library/react';
import ProductList from '../pages/index';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

const setup = () => {
  const renderResult = render(<ProductList />);
  return { ...renderResult };
};

describe('ProductList', () => {
  const mockedAxios = jest.mocked(axios);

  it('should render the component', async () => {
    act(() => {
      mockedAxios.get.mockResolvedValueOnce({ data: { products: [] } });
    });

    setup();

    await waitFor(() => {
      expect(screen.getByTestId('product-list-tid')).toBeInTheDocument();
    });
  });

  it('should render the loading spinner', () => {
    act(() => {
      mockedAxios.get.mockResolvedValueOnce({ data: { products: [] } });
    });

    setup();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render error message when axios call reject', async () => {
    const message = 'Unit test - Erro ao carregar lista';
    act(() => {
      mockedAxios.get.mockRejectedValueOnce(new Error(message));
    });

    setup();

    await waitFor(() => {
      expect(screen.getByText(new RegExp(message, 'i'))).toBeInTheDocument();
    });
  });

  it('should render the ProductCart component 10 times', async () => {
    act(() => {
      mockedAxios.get.mockResolvedValueOnce({ data: { products: [] } });
    });

    setup();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-cart-tid')).toHaveLength(10);
    });
  });

  it.todo('should render empty state for product list');

  it.todo('should render the Search component');

  it.todo('should filter the product list when search is performed');

  it.todo('should display error message when promise rejects');

  it.todo('should display the total quantity of products');

  it.todo('should display product (singular) when there is only 1 product');

  it.todo('should display products (plural) when has more than 1 product');
});
