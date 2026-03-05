import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children, initialCart }) {
  const [cartData, setCartData] = useState(initialCart || {
    cartItems: [],
    shipping_fee: 50,
    discount_applied: 0,
  });
  const [shippingAddress, setShippingAddress] = useState(null);

  const subtotal = cartData.cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;

  return (
    <CartContext.Provider value={{
      cartData,
      setCartData,
      shippingAddress,
      setShippingAddress,
      subtotal,
      total,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}