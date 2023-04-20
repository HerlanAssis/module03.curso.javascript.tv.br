import { useFetchProducts } from '@/hooks';
import Router from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import ProductCard from '@/components/product-card';
import Search from '@/components/search';
import { useCartStore } from '@/store';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { products, error, loading } = useFetchProducts();
  const addToCart = useCartStore((state) => state.actions.add);

  const productFilteredList = useMemo(() => {
    if (searchTerm.length) {
      return products.filter((product) =>
        product.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
      );
    }

    return products;
  }, [searchTerm, products]);

  const renderProductQuantity = () => {
    if (productFilteredList.length > 1) {
      return `${productFilteredList.length} Products`;
    }

    return `${productFilteredList.length} Product`;
  };

  const renderProducts = useCallback(() => {
    if (!productFilteredList.length) {
      return (
        <div className="m-16" data-testid="empty-product-list-tid">
          <p className="font-bold">Nenhum produto na lista.</p>
        </div>
      );
    }
    return productFilteredList.map((product) => (
      <ProductCard key={product.id} product={product} addToCart={() => addToCart(product)} />
    ));
  }, [productFilteredList, addToCart]);

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
          data-testid="reload-page-tid"
        >
          Regarregar página?
        </button>
      </div>
    );
  }

  return (
    <main className="my-8" data-testid="product-list-tid">
      <Search doSearch={(term) => setSearchTerm(term)} />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">{renderProductQuantity()}</span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {renderProducts()}
        </div>
      </div>
    </main>
  );
}
