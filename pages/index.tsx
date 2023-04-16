import { useFetchProducts } from '@/hooks';
import Router from 'next/router';
import { useCallback } from 'react';
import ProductCard from '@/components/product-card';
import Search from '@/components/search';

export default function Home() {
  const { products, error, loading } = useFetchProducts();

  const renderProducts = useCallback(() => {
    if (!products.length) {
      return (
        <div className="m-16" data-testid="empty-product-list-tid">
          <p className="font-bold">Nenhum produto na lista.</p>
        </div>
      );
    }
    return products.map((product) => (
      <ProductCard key={product.id} product={product} addToCart={() => {}} />
    ));
  }, [products]);

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
