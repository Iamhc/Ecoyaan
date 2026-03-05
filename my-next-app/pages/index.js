import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';
import { useCart } from '../context/CartContext';

export async function getServerSideProps(context) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`;
  let cartData;
  try {
    const res = await fetch(`${baseUrl}/api/cart`);
    cartData = await res.json();
  } catch (e) {
    cartData = {
      cartItems: [
        { product_id: 101, product_name: "Bamboo Toothbrush (Pack of 4)", product_price: 299, quantity: 2, image: "https://via.placeholder.com/150/2D6A4F/ffffff?text=🪥" },
        { product_id: 102, product_name: "Reusable Cotton Produce Bags", product_price: 450, quantity: 1, image: "https://via.placeholder.com/150/52B788/ffffff?text=🛍️" },
      ],
      shipping_fee: 50,
      discount_applied: 0,
    };
  }
  return { props: { cartData } };
}

export default function CartPage({ cartData }) {
  const router = useRouter();
  const { cartData: cart, setCartData } = useCart();

  const data = cart?.cartItems?.length ? cart : cartData;
  const [items, setItems] = useState(data.cartItems);

  const updateQty = (product_id, delta) => {
    setItems(prev => {
      const updated = prev
        .map(i => i.product_id === product_id ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0);
      setCartData({ ...data, cartItems: updated });
      return updated;
    });
  };

  const removeItem = (product_id) => {
    setItems(prev => {
      const updated = prev.filter(i => i.product_id !== product_id);
      setCartData({ ...data, cartItems: updated });
      return updated;
    });
  };

  const sub = items.reduce((s, i) => s + i.product_price * i.quantity, 0);
  const grandTotal = sub + data.shipping_fee - data.discount_applied;
  const savings = data.discount_applied > 0 ? data.discount_applied : null;

  return (
    <Layout title="Cart – Ecoyaan">
      {/* Page Header */}
      <div className="mb-8">
        <Stepper />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-bold text-green-900 mb-1">
              Your Cart
            </h1>
            <p className="text-gray-500 text-sm">
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
                🛒 {items.length} item{items.length !== 1 ? 's' : ''} in your bag
              </span>
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Empty cart state */}
      {items.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-all"
          >
            Start Shopping
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-green-50 relative">
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://placehold.co/144x144/D8F3DC/2D6A4F?text=🌿`; }}
                    />
                    <span className="absolute top-2 left-2 bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-green-100">
                      ♻️ Eco
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                          {item.product_name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">Product ID: #{item.product_id}</p>
                      </div>
                      {/* 🗑 Remove button */}
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-red-50"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Unit price</p>
                        <p className="text-green-700 font-bold text-lg">₹{item.product_price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* ➕➖ Quantity controls */}
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQty(item.product_id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold text-lg"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-800 border-x border-gray-200 py-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product_id, +1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors font-bold text-lg"
                          >
                            +
                          </button>
                        </div>

                        {/* Item total */}
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="font-bold text-gray-900 text-base">
                            ₹{(item.product_price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🌱', label: '100% Eco', sub: 'Sustainably sourced' },
                { icon: '🔄', label: 'Easy Returns', sub: '7-day return policy' },
                { icon: '🚚', label: 'Fast Delivery', sub: '3–5 business days' },
              ].map(b => (
                <div key={b.label} className="bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <p className="text-xs font-semibold text-green-800">{b.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Eco impact banner */}
            <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg">
              <div className="text-3xl">🌍</div>
              <div>
                <p className="font-bold text-sm">Your order makes a difference!</p>
                <p className="text-green-200 text-xs mt-0.5">
                  By choosing Ecoyaan, you're helping reduce plastic waste and support sustainable practices.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-green-900 text-xl mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                {items.map(item => (
                  <div key={item.product_id} className="flex justify-between text-gray-500">
                    <span className="truncate mr-2 max-w-[60%]">
                      {item.product_name} <span className="text-gray-400">×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-700 flex-shrink-0">
                      ₹{(item.product_price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="border-t border-dashed border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-700">₹{sub.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1">
                      Shipping
                      <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">Standard</span>
                    </span>
                    <span className="font-medium text-gray-700">₹{data.shipping_fee}</span>
                  </div>
                  {savings && (
                    <div className="flex justify-between text-green-600">
                      <span>🎉 Discount</span>
                      <span className="font-semibold">−₹{savings}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex justify-between items-center mt-2">
                  <div>
                    <p className="text-xs text-green-700 font-medium">Amount Payable</p>
                    <p className="text-2xl font-bold text-green-900">₹{grandTotal.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Incl. all taxes</p>
                    {savings && (
                      <p className="text-xs text-green-600 font-semibold mt-0.5">You save ₹{savings}!</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/shipping')}
                className="w-full mt-5 bg-green-700 hover:bg-green-800 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 text-base"
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
                <span>🔒 SSL Secured</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>✅ Safe Checkout</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>🛡️ Buyer Protection</span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                {['UPI', 'Visa', 'Mastercard', 'RuPay', 'COD'].map(p => (
                  <span key={p} className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2.5 py-1 rounded-lg font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}