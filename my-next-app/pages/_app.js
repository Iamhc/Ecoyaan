import { CartProvider } from '../context/CartContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider initialCart={pageProps.cartData}>
      <Component {...pageProps} />
    </CartProvider>
  );
}
