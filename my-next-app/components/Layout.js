import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children, title = 'Ecoyaan Checkout' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-eco-cream">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-eco-green rounded-lg flex items-center justify-center text-white font-display font-bold text-sm">E</div>
              <span className="font-display font-semibold text-eco-dark text-xl">Ecoyaan</span>
            </Link>
            <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Secure Checkout</span>
            <div className="flex items-center gap-1 text-eco-green text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              SSL Secured
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-gray-400">
          © 2024 Ecoyaan · Sustainable Living
        </footer>
      </div>
    </>
  );
}
