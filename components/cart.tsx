import clsx from 'clsx';
import { useCartStore } from '@/store';
import CartItem from './cart-item';

export default function Cart() {
  const { open: cartOpen, products } = useCartStore((store) => store.state);
  const { toggle: toggleCart, clear } = useCartStore((store) => store.actions);

  const renderCartItems = () => {
    return products.map((product) => <CartItem key={product.id} product={product} />);
  };

  // TODO add correct implementation
  const handleCheckout = () => {
    clear();
    toggleCart();
  };

  const hasProducts = !!products.length;

  return (
    <div
      data-testid="cart-tid"
      className={clsx(
        'fixed right-0 top-0 max-w-xs w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300 z-50',
        !cartOpen && 'hidden',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-medium text-gray-700">Your cart</h3>
          <span className="text-gray-700 mx-2" data-testid="quantity.tid">
            {products.length}
          </span>
        </div>
        {hasProducts && (
          <button data-testid="clear-cart-button-tid" onClick={clear}>
            Clear
          </button>
        )}
        <button
          data-testid="close-cart-tid"
          className="text-gray-600 focus:outline-none"
          onClick={toggleCart}
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
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <hr className="my-3" />
      {!hasProducts && (
        <h4 className="text-center text-bold text-blue-600">There are no items in the cart.</h4>
      )}
      {renderCartItems()}
      {hasProducts && (
        <button
          onClick={handleCheckout}
          data-testid="checkout-cart-button-tid"
          className="flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
        >
          <span>Checkout</span>
          <svg
            className="h-5 w-5 mx-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
