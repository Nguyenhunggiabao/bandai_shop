import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AppState, CartItem, Product, User } from './types';

const initialState: AppState = {
  currentPage: 'home',
  selectedProduct: null,
  cart: [],
  user: null,
  isLoggedIn: false,
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);

  // ── Navigation ──
  const navigate = (page: AppState['currentPage']) => {
    setState(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Auth ──
  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, user, isLoggedIn: true, currentPage: 'home' }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null, isLoggedIn: false }));
  };

  // ── Product ──
  const handleViewDetail = (product: Product) => {
    setState(prev => ({ ...prev, selectedProduct: product, currentPage: 'product-detail' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Cart ──
  const handleAddToCart = (product: Product) => {
    setState(prev => {
      const existing = prev.cart.find(item => item.product.id === product.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...prev,
        cart: [...prev.cart, { product, quantity: 1 }],
      };
    });
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    navigate('checkout');
  };

  const handleUpdateCart = (cart: CartItem[]) => {
    setState(prev => ({ ...prev, cart }));
  };

  const handleOrderSuccess = (_orderId: string) => {
    setState(prev => ({ ...prev, cart: [], currentPage: 'checkout' }));
  };

  // ── Render ──
  const showNavbar = state.currentPage !== 'login';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      {showNavbar && (
        <Navbar
          user={state.user}
          cart={state.cart}
          currentPage={state.currentPage}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      <main style={{ paddingTop: showNavbar ? '70px' : '0' }}>
        {state.currentPage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLogin}
            onNavigateHome={() => navigate('home')}
          />
        )}

        {state.currentPage === 'home' && (
          <HomePage
            cart={state.cart}
            onViewDetail={handleViewDetail}
            onAddToCart={handleAddToCart}
          />
        )}

        {state.currentPage === 'product-detail' && state.selectedProduct && (
          <ProductDetailPage
            product={state.selectedProduct}
            cart={state.cart}
            onBack={() => navigate('home')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {state.currentPage === 'checkout' && (
          <CheckoutPage
            cart={state.cart}
            onUpdateCart={handleUpdateCart}
            onNavigate={navigate}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </main>
    </div>
  );
}