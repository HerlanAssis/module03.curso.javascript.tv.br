import { useState } from 'react';
import { CartItemInterface } from './types';
import Image from 'next/image';
import { useCartStore } from '@/store';

export default function CartItem({ product }: CartItemInterface) {
  const { remove, increase, decrease } = useCartStore((store) => store.actions);

  const isDecreaseButtonDisabled = (product?.quantity ?? 0) === 0;

  const decreaseQuantity = () => decrease(product.id);

  const increaseQuantity = () => increase(product.id);

  const removeProduct = () => remove(product.id);

  return (
    <div data-testid="cart-item-tid" className="flex justify-between mt-6">
      <div className="flex">
        <Image
          data-testid="pimage-tid"
          className="h-20 w-20 object-cover rounded"
          src={product.image}
          alt={product.title}
          width={400}
          height={400}
        />
        <div className="mx-3">
          <h3 className="text-sm text-gray-600">{product.title}</h3>
          <button data-testid="remove-button-tid" onClick={removeProduct}>
            Remove item
          </button>
          <div className="flex items-center mt-2">
            <button
              onClick={decreaseQuantity}
              disabled={isDecreaseButtonDisabled}
              data-testid="decrease-button-tid"
              className="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
            <span data-testid="quantity-tid" className="text-gray-700 mx-2">
              {product?.quantity ?? 0}
            </span>
            <button
              data-testid="increase-button-tid"
              onClick={increaseQuantity}
              className="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <span className="text-gray-600">${product.price}</span>
    </div>
  );
}
