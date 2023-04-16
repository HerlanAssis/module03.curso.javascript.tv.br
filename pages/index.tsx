import { ProductInterface } from '@/components/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router';
import ProductCard from '../components/product-card';
import Search from '../components/search';

const InitialState = [
  {
    id: '1',
    title: 'Relógio bonito',
    price: '22.00',
    image:
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
];

export default function Home() {
  const [products, setProducts] = useState<ProductInterface[]>(InitialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const renderProducts = useCallback(() => {
    return products.map((product) => (
      <ProductCard key={product.id} product={product} addToCart={() => {}} />
    ));
  }, [products]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const {
          data: { products },
        } = await axios.get<{ products: ProductInterface[] }>('/api/products');

        setProducts(products);

        setError(null);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen m-auto" role="status">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!!error) {
    return (
      <div className="m-16">
        <p className="font-bold">
          Erro ao carregar lista: {JSON.stringify(error.message, null, 2)}
        </p>
        <button
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => Router.reload()}
        >
          Regarregar página?
        </button>
      </div>
    );
  }

  return (
    <main className="my-8" data-testid="product-list-tid">
      <Search />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">200+ Products</span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {renderProducts()}
        </div>
      </div>
    </main>
  );
}
