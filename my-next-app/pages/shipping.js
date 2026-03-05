import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';
import { useCart } from '../context/CartContext';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  pinCode: '',
  city: '',
  state: '',
};

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit phone number';
  if (!form.pinCode.trim()) errors.pinCode = 'PIN code is required';
  else if (!/^\d{6}$/.test(form.pinCode)) errors.pinCode = 'Enter a valid 6-digit PIN code';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state) errors.state = 'Please select a state';
  return errors;
}

export default function ShippingPage() {
  const router = useRouter();
  const { setShippingAddress, subtotal, total, cartData } = useCart();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate({ ...form });
    setErrors(prev => ({ ...prev, [name]: errs[name] || '' }));
  };

  const handleSubmit = () => {
    const allTouched = Object.keys(initialForm).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setShippingAddress(form);
      router.push('/payment');
    }
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', placeholder: 'Sarwan Singh', type: 'text', col: 2 },
    { name: 'email', label: 'Email Address', placeholder: 'you@example.com', type: 'email', col: 1 },
    { name: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', type: 'tel', col: 1 },
    { name: 'pinCode', label: 'PIN Code', placeholder: '6-digit PIN', type: 'text', col: 1 },
    { name: 'city', label: 'City', placeholder: 'Your city', type: 'text', col: 1 },
  ];

  return (
    <Layout title="Shipping – Ecoyaan">
      <Stepper />
      <h1 className="font-display text-3xl font-bold text-eco-dark mb-2">Shipping Details</h1>
      <p className="text-gray-500 text-sm mb-6">Tell us where to deliver your eco-friendly order</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(field => (
                <div key={field.name} className={field.col === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-eco-dark mb-1.5 uppercase tracking-wide">
                    {field.label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${touched[field.name] && errors[field.name] ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              {/* State dropdown */}
              <div>
                <label className="block text-xs font-semibold text-eco-dark mb-1.5 uppercase tracking-wide">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${touched.state && errors.state ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                >
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {touched.state && errors.state && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.state}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button onClick={() => router.back()} className="btn-outline flex-1">
                ← Back to Cart
              </button>
              <button onClick={handleSubmit} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Continue to Payment
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mini order summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="font-display font-bold text-eco-dark text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {cartData?.cartItems?.map(item => (
                <div key={item.product_id} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.product_name} ×{item.quantity}</span>
                  <span className="font-medium flex-shrink-0">₹{(item.product_price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-dashed pt-2 flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{cartData?.shipping_fee}</span>
              </div>
              <div className="flex justify-between font-bold text-eco-dark text-base pt-1">
                <span>Total</span>
                <span>₹{(cartData?.cartItems?.reduce((s, i) => s + i.product_price * i.quantity, 0) + (cartData?.shipping_fee || 50)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
