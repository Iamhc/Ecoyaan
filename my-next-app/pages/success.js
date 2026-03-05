import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

function ConfettiPiece({ style }) {
  return <div className="absolute w-2 h-2 rounded-sm animate-bounce" style={style} />;
}

export default function SuccessPage() {
  const router = useRouter();
  const { cartData, shippingAddress } = useCart();
  const [show, setShow] = useState(false);
  const orderId = `ECO${Math.floor(100000 + Math.random() * 900000)}`;

  const subtotal = cartData?.cartItems?.reduce((s, i) => s + i.product_price * i.quantity, 0) || 0;
  const total = subtotal + (cartData?.shipping_fee || 50);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const confettiColors = ['#2D6A4F', '#52B788', '#D8F3DC', '#6B4C3B', '#FFD700'];
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    backgroundColor: confettiColors[i % confettiColors.length],
    animationDelay: `${Math.random() * 1}s`,
    animationDuration: `${0.8 + Math.random() * 0.8}s`,
    transform: `rotate(${Math.random() * 360}deg)`,
  }));

  return (
    <>
      <Head>
        <title>Order Confirmed – Ecoyaan</title>
      </Head>
      <div className="min-h-screen bg-eco-cream flex items-center justify-center p-4 relative overflow-hidden">
        {confetti.map((style, i) => <ConfettiPiece key={i} style={style} />)}

        <div className={`max-w-lg w-full transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Success icon */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-eco-green rounded-full flex items-center justify-center mx-auto shadow-xl shadow-eco-green/30">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 text-2xl animate-pulse">🌿</div>
            </div>
            <h1 className="font-display text-4xl font-bold text-eco-dark mt-6 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500">Thank you for choosing sustainable living 🌍</p>
          </div>

          {/* Order card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-dashed border-gray-200">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Order ID</p>
                <p className="font-bold text-eco-dark font-mono text-lg">{orderId}</p>
              </div>
              <span className="bg-eco-pale text-eco-green text-xs font-semibold px-3 py-1.5 rounded-full">✓ Confirmed</span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {cartData?.cartItems?.map(item => (
                <div key={item.product_id} className="flex justify-between text-sm text-gray-700">
                  <span>{item.product_name} ×{item.quantity}</span>
                  <span className="font-medium">₹{(item.product_price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                <span>Shipping</span>
                <span>₹{cartData?.shipping_fee || 50}</span>
              </div>
              <div className="flex justify-between font-bold text-eco-dark text-base pt-1">
                <span>Total Paid</span>
                <span className="text-eco-green">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address */}
            {shippingAddress && (
              <div className="bg-eco-pale rounded-xl p-3 text-sm">
                <p className="text-xs font-semibold text-eco-dark uppercase tracking-wide mb-1">Delivering to</p>
                <p className="text-gray-700">{shippingAddress.fullName} · {shippingAddress.city}, {shippingAddress.state}</p>
                <p className="text-gray-500 text-xs">{shippingAddress.email}</p>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-700">
              📦 Estimated delivery: <strong>3–5 business days</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link href="/" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
              🛍️ Continue Shopping
            </Link>
            <button onClick={() => window.print()} className="btn-outline flex-1 flex items-center justify-center gap-2">
              🖨️ Print Receipt
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            A confirmation email has been sent to {shippingAddress?.email || 'your email'}
          </p>
        </div>
      </div>
    </>
  );
}
