import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';
import { useCart } from '../context/CartContext';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
];

export default function PaymentPage() {
  const router = useRouter();
  const { cartData, shippingAddress } = useCart();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const subtotal = cartData?.cartItems?.reduce((s, i) => s + i.product_price * i.quantity, 0) || 0;
  const total = subtotal + (cartData?.shipping_fee || 50) - (cartData?.discount_applied || 0);

  const handlePay = async () => {
    setLoading(true);
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1800));
    router.push('/success');
  };

  // Fallback if someone lands here without going through cart
  const address = shippingAddress || {
    fullName: 'Demo User', email: 'demo@ecoyaan.com',
    phone: '9876543210', city: 'Delhi', state: 'Delhi', pinCode: '110001',
  };

  return (
    <Layout title="Payment – Ecoyaan">
      <Stepper />
      <h1 className="font-display text-3xl font-bold text-eco-dark mb-2">Review & Pay</h1>
      <p className="text-gray-500 text-sm mb-6">Almost there! Confirm your order details below</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Shipping Address Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-eco-dark flex items-center gap-2">
                <span className="text-eco-green">📍</span> Delivery Address
              </h2>
              <button onClick={() => router.push('/shipping')} className="text-xs text-eco-green hover:underline font-medium">Edit</button>
            </div>
            <div className="bg-eco-pale rounded-xl p-4 text-sm text-eco-dark space-y-1">
              <p className="font-semibold text-base">{address.fullName}</p>
              <p className="text-gray-600">{address.email}</p>
              <p className="text-gray-600">+91 {address.phone}</p>
              <p className="text-gray-600">{address.city}, {address.state} – {address.pinCode}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <h2 className="font-semibold text-eco-dark mb-3 flex items-center gap-2">
              <span className="text-eco-green">🛒</span> Order Items
            </h2>
            <div className="space-y-3">
              {cartData?.cartItems?.map(item => (
                <div key={item.product_id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-eco-pale flex-shrink-0">
                    <img src={item.image} alt={item.product_name} className="w-full h-full object-cover"
                      onError={e => e.target.src = 'https://placehold.co/48x48/D8F3DC/2D6A4F?text=🌿'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-eco-dark truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-eco-dark text-sm">₹{(item.product_price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card">
            <h2 className="font-semibold text-eco-dark mb-3 flex items-center gap-2">
              <span className="text-eco-green">💳</span> Payment Method
            </h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(method => (
                <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMethod === method.id ? 'border-eco-green bg-eco-pale' : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="accent-eco-green"
                  />
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <p className="font-semibold text-eco-dark text-sm">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Summary + Pay */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="font-display font-bold text-eco-dark text-xl mb-4">Price Breakdown</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">₹{cartData?.shipping_fee || 50}</span>
              </div>
              {(cartData?.discount_applied || 0) > 0 && (
                <div className="flex justify-between text-eco-green">
                  <span>Discount</span>
                  <span className="font-medium">−₹{cartData.discount_applied}</span>
                </div>
              )}
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-bold text-eco-dark text-lg">
                <span>Total Payable</span>
                <span className="text-eco-green">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className={`btn-primary w-full mt-6 flex items-center justify-center gap-2 text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Processing...
                </>
              ) : (
                <>🔒 Pay Securely · ₹{total.toLocaleString()}</>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>🔐 256-bit SSL</span>
              <span>✅ PCI DSS</span>
              <span>🛡️ Fraud Protection</span>
            </div>

            <button onClick={() => router.back()} className="w-full text-center text-xs text-gray-400 hover:text-eco-green mt-3 transition-colors">
              ← Edit shipping address
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
