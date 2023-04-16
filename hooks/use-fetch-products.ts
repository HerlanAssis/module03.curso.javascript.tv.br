import { ProductInterface } from '@/components/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetchProducts = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
        if (axios.isAxiosError(error)) {
          setError(new Error(error.response?.data.message));
        }
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return { products, loading, error };
};

export default useFetchProducts;
